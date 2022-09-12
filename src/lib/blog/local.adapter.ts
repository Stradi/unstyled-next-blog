import { BlogAuthor, BlogPost, BlogTag } from '.';
import path from 'path';
import fs from 'fs-extra';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve(process.cwd(), '_content');

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const directoryPath = path.join(CONTENT_DIR, 'posts');
  const files = await fs.readdir(directoryPath);
  const posts = [];

  for (const file of files) {
    posts.push(await getPostBySlug(file));
  }

  return posts;
};

export const getPostBySlug = async (slug: string): Promise<BlogPost> => {
  const directoryPath = path.join(CONTENT_DIR, 'posts', slug);
  const markdownFilePath = path.join(directoryPath, 'index.md');

  const rawContent = await fs.readFile(markdownFilePath, 'utf-8');
  const fileStats = await fs.stat(markdownFilePath);

  const parsedContent = matter(rawContent);

  const authors = await populateAuthors(parsedContent.data.authors);
  const tags = await populateTags(parsedContent.data.tags);

  return {
    name: parsedContent.data.name,
    slug,
    description: parsedContent.data.description,
    createdAt: new Date(fileStats.birthtime),
    updatedAt: new Date(fileStats.mtime),
    image: {
      src: parsedContent.data.image.src,
      alt: parsedContent.data.image.alt,
    },
    authors,
    tags,
  } as BlogPost;
};

export const getPostsByTag = async (name: string): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.some((tag) => tag.name === name));
};

export const getPostsByAuthor = async (name: string): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) =>
    post.authors.some((author) => author.name === name)
  );
};

export const getAllAuthors = async (): Promise<BlogAuthor[]> => {
  const filePath = path.join(CONTENT_DIR, 'authors.json');
  const rawContent = await fs.readFile(filePath, 'utf-8');
  const parsedContent = JSON.parse(rawContent);

  return parsedContent as BlogAuthor[];
};

export const getAuthorByName = async (name: string): Promise<BlogAuthor> => {
  const filePath = path.join(CONTENT_DIR, 'authors.json');
  const rawContent = await fs.readFile(filePath, 'utf-8');
  const parsedContent = JSON.parse(rawContent);

  return parsedContent.find((author) => author.name === name) as BlogAuthor;
};

export const getAllTags = async (): Promise<BlogTag[]> => {
  const filePath = path.join(CONTENT_DIR, 'tags.json');
  const rawContent = await fs.readFile(filePath, 'utf-8');
  const parsedContent = JSON.parse(rawContent);

  return parsedContent as BlogTag[];
};

export const getTagByName = async (name: string): Promise<BlogTag> => {
  const filePath = path.join(CONTENT_DIR, 'tags.json');
  const rawContent = await fs.readFile(filePath, 'utf-8');
  const parsedContent = JSON.parse(rawContent);

  return parsedContent.find((tag) => tag.name === name) as BlogTag;
};

const populateAuthors = async (names: string[]): Promise<BlogAuthor[]> => {
  const authors = [];

  for (const name of names) {
    authors.push(await getAuthorByName(name));
  }

  return authors;
};

const populateTags = async (names: string[]): Promise<BlogTag[]> => {
  const tags = [];
  for (const name of names) {
    tags.push(await getTagByName(name));
  }

  return tags;
};
