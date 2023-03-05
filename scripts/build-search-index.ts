import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { create, insertBatch, save } from '@lyrasearch/lyra';

async function getAllAuthors() {
  const dir = path.resolve(__dirname, '..', '_content', 'authors');
  const files = await fs.readdir(dir);

  const authors = [];
  for (const file of files) {
    const content = await fs.readJson(path.join(dir, file));
    authors.push({
      type: 'author',
      name: content.name,
      slug: path.basename(file, '.json'),
      description: content.description,
      content: '',
    });
  }

  return authors;
}

async function getAllTags() {
  const dir = path.resolve(__dirname, '..', '_content', 'tags');
  const files = await fs.readdir(dir);

  const tags = [];
  for (const file of files) {
    const content = await fs.readJson(path.join(dir, file));
    tags.push({
      type: 'tag',
      name: content.name,
      slug: path.basename(file, '.json'),
      description: content.description,
      content: '',
    });
  }

  return tags;
}

async function getAllPosts() {
  const dir = path.resolve(__dirname, '..', '_content', 'posts');
  const folders = await fs.readdir(dir);

  const posts = [];
  for (const folder of folders) {
    const content = await fs.readFile(path.join(dir, folder, 'index.mdx'));
    const parsed = matter(content);

    posts.push({
      type: 'blog',
      name: parsed.data.name,
      slug: folder,
      description: parsed.data.description,
      content: parsed.content,
    });
  }

  return posts;
}

async function getAllStaticPages() {
  const dir = path.resolve(__dirname, '..', '_content', 'pages');
  const folders = await fs.readdir(dir);

  const posts = [];
  for (const folder of folders) {
    const content = await fs.readFile(path.join(dir, folder, 'index.mdx'));
    const parsed = matter(content);

    posts.push({
      type: 'page',
      name: parsed.data.name,
      slug: folder,
      description: parsed.data.description,
      content: parsed.content,
    });
  }

  return posts;
}

async function main() {
  console.log('Building search index...');

  await fs.ensureDir(path.resolve(__dirname, '..', 'public'));
  const index = await create({
    schema: {
      type: 'string',
      name: 'string',
      slug: 'string',
      description: 'string',
      content: 'string',
    },
  });

  console.log('Fetching all the content...');
  const authors = await getAllAuthors();
  const tags = await getAllTags();
  const posts = await getAllPosts();
  const pages = await getAllStaticPages();

  const allContent = [...authors, ...tags, ...posts, ...pages];

  console.log('Inserting content into the index...');
  await insertBatch(index, allContent);
  console.log('Writing index to disk...');
  const saveableIndex = await save(index);
  await fs.writeJson(path.resolve(__dirname, '..', 'public', 'search-index.json'), saveableIndex);
  console.log('Done!');
}

main();
