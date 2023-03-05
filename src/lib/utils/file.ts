import fs from 'fs-extra';
import matter from 'gray-matter';
import path from 'path';
import { remarkNextImage } from '@/lib/blog/remark-next-image';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

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

export async function moveImagesToPublicFolder(
  sourceDirectory: string,
  slug: string,
  type: 'blog' | 'pages' = 'blog'
): Promise<void> {
  const destination = path.join(PUBLIC_DIR, 'images', type, slug);
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

export async function moveImageToPublicFolder(destinationPath: string, sourceFile: string): Promise<void> {
  const destination = path.join(PUBLIC_DIR, 'images', destinationPath);
  await fs.ensureDir(destination);

  await fs.copyFile(sourceFile, path.join(destination, path.basename(sourceFile)));
}

export async function convertToMarkdown(
  content: string,
  slug: string,
  type: 'blog' | 'pages' = 'blog'
): Promise<MDXRemoteSerializeResult> {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [[remarkNextImage, { publicPath: path.join('images', type, slug).toString() }]],
    },
    parseFrontmatter: true,
  });
}
