import fs from 'fs-extra';
import path from 'path';
import config from '@/config';

const URL_TEMPLATE = `<url>
  <loc>%loc%</loc>
  <lastmod>%lastmod%</lastmod>
  <changefreq>%changefreq%</changefreq>
  <priority>%priority%</priority>
</url>
`;

const CHANGE_FREQ = {
  hourly: 0.8,
  daily: 0.6,
  weekly: 0.4,
  monthly: 0.2,
  yearly: 0.1,
  never: 0,
};

function getChangeFreq(createdTimeMs: number, lastModifiedTimeMs: number) {
  const diff = lastModifiedTimeMs - createdTimeMs;
  if (diff === 0) {
    return 'never';
  }
  if (diff < 1000 * 60 * 60 * 24) {
    return 'hourly';
  }
  if (diff < 1000 * 60 * 60 * 24 * 7) {
    return 'daily';
  }
  if (diff < 1000 * 60 * 60 * 24 * 30) {
    return 'weekly';
  }
  if (diff < 1000 * 60 * 60 * 24 * 365) {
    return 'monthly';
  }
  return 'yearly';
}

function generateUrlData(file: string, slug: string, type: string) {
  const stats = fs.statSync(file);
  return {
    type,
    slug,
    lastModified: stats.mtime,
    changeFreq: getChangeFreq(stats.birthtimeMs, stats.mtimeMs),
    priority: CHANGE_FREQ[getChangeFreq(stats.birthtimeMs, stats.mtimeMs)],
  };
}

async function getAllAuthors() {
  const dir = path.resolve(__dirname, '..', '_content', 'authors');
  const files = await fs.readdir(dir);

  return files.map((file) => generateUrlData(path.join(dir, file), path.basename(file, '.json'), 'author'));
}

async function getAllTags() {
  const dir = path.resolve(__dirname, '..', '_content', 'tags');
  const files = await fs.readdir(dir);
  return files.map((file) => generateUrlData(path.join(dir, file), path.basename(file, '.json'), 'tag'));
}

async function getAllPosts() {
  const dir = path.resolve(__dirname, '..', '_content', 'posts');
  const folders = await fs.readdir(dir);

  return folders.map((folder) => generateUrlData(path.join(dir, folder, 'index.mdx'), folder, 'blog'));
}

async function getAllStaticPages() {
  const dir = path.resolve(__dirname, '..', '_content', 'pages');
  const folders = await fs.readdir(dir);

  return folders.map((folder) => generateUrlData(path.join(dir, folder, 'index.mdx'), folder, 'page'));
}

async function main() {
  console.log('Generating sitemap.xml...');

  await fs.ensureDir(path.resolve(__dirname, '..', 'public'));
  const resources = [
    ...(await getAllPosts()),
    ...(await getAllAuthors()),
    ...(await getAllTags()),
    ...(await getAllStaticPages()),
  ];

  console.log(`Found ${resources.length} resources.`);

  let sitemap = '';
  sitemap += '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const resource of resources) {
    let finalUrl = URL_TEMPLATE;
    finalUrl = finalUrl.replace('%lastmod%', resource.lastModified.toISOString());
    finalUrl = finalUrl.replace('%changefreq%', resource.changeFreq);
    finalUrl = finalUrl.replace('%priority%', resource.priority.toString());
    if (resource.type === 'page') {
      finalUrl = finalUrl.replace('%loc%', `${config.site.url}/${resource.slug}`);
    } else {
      finalUrl = finalUrl.replace('%loc%', `${config.site.url}/${resource.type}/${resource.slug}`);
    }

    sitemap += finalUrl;
  }

  sitemap += '</urlset>';

  console.log('Writing sitemap.xml...');
  await fs.writeFile(path.resolve(__dirname, '..', 'public', 'sitemap.xml'), sitemap);
  console.log('Done!');
}

main();
