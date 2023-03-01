import fs from 'fs-extra';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { remarkNextImage } from '@/lib/blog/remark-next-image';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

export interface FileWithDetails {
  content: string;
  details: fs.Stats;
  frontmatter?: {
    [key: string]: any;
  };
}

export async function getFileWithDetails(filePath: fs.PathLike, parseFrontmatter?: boolean): Promise<FileWithDetails> {
  const content = await fs.readFile(filePath, 'utf-8');
  const details = await fs.stat(filePath);

  if (parseFrontmatter) {
    const parsed = matter(content);

    return {
      content: parsed.content,
      details,
      frontmatter: parsed.data,
    };
  }

  return {
    content,
    details,
  } as FileWithDetails;
}

export async function moveImagesToPublicFolder(sourceDirectory, slug: string): Promise<void> {
  const destination = path.join(PUBLIC_DIR, 'images', 'blog', slug);
  await fs.ensureDir(destination);

  const allFiles = await fs.readdir(path.join(sourceDirectory, slug));
  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file);
    return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
  });

  for (const file of imageFiles) {
    await fs.copyFile(path.join(sourceDirectory, slug, file), path.join(destination, file));
  }
}

export async function convertToMarkdown(content: string, slug: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml)
    .use(remarkNextImage, {
      publicPath: path.join('images', 'blog', slug).toString(),
    })
    .process(content);
  return result.toString();
}
