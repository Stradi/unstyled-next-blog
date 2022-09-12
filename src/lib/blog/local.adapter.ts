import fs from 'fs-extra';
import path from 'path';
import { BlogAuthor, BlogPost, BlogTag } from '.';
import { getFileWithDetails } from '../utils/file';
import { slugify } from '../utils/slugify';

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

  const fileDetails = await getFileWithDetails(markdownFilePath, true);
  const authors = await populateAuthors(fileDetails.frontmatter.authors);
  const tags = await populateTags(fileDetails.frontmatter.tags);

  return {
    name: fileDetails.frontmatter.name,
    slug,
    description: fileDetails.frontmatter.description,
    createdAt: new Date(fileDetails.details.birthtime),
    updatedAt: new Date(fileDetails.details.mtime),
    image: {
      src: fileDetails.frontmatter.image.src,
      alt: fileDetails.frontmatter.image.alt,
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
  const filePath = path.join(CONTENT_DIR, 'authors');
  const files = await fs.readdir(filePath);
  const authors = [];

  for (const file of files) {
    authors.push(await getAuthorByName(file));
  }

  return authors;
};

export const getAuthorByName = async (name: string): Promise<BlogAuthor> => {
  const slug = slugify(name);
  const filePath = path.join(CONTENT_DIR, 'authors', `${slug}.json`);

  const fileDetails = await getFileWithDetails(filePath, false);
  const json = JSON.parse(fileDetails.content);
  delete json['$schema'];

  return {
    name: json.name,
    slug,
    description: json.description,
    createdAt: fileDetails.details.birthtime,
    updatedAt: fileDetails.details.mtime,
    image: {
      src: json.image.src,
      alt: json.image.alt,
    },
  } as BlogAuthor;
};

export const getAllTags = async (): Promise<BlogTag[]> => {
  const filePath = path.join(CONTENT_DIR, 'tags');
  const files = await fs.readdir(filePath);
  const tags = [];

  for (const file of files) {
    tags.push(await getTagByName(file));
  }

  return tags;
};

export const getTagByName = async (name: string): Promise<BlogTag> => {
  const slug = slugify(name);
  const filePath = path.join(CONTENT_DIR, 'tags', `${slug}.json`);

  const fileDetails = await getFileWithDetails(filePath, false);
  const json = JSON.parse(fileDetails.content);
  delete json['$schema'];

  return {
    name: json.name,
    slug,
    description: json.description,
    createdAt: fileDetails.details.birthtime,
    updatedAt: fileDetails.details.mtime,
    image: {
      src: json.image.src,
      alt: json.image.alt,
    },
  } as BlogTag;
};

const populateAuthors = async (names: string[]): Promise<BlogAuthor[]> => {
  const authors = [];

  for (const name of names) {
    const slug = slugify(name);
    authors.push(await getAuthorByName(slug));
  }

  return authors;
};

const populateTags = async (names: string[]): Promise<BlogTag[]> => {
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    tags.push(await getTagByName(slug));
  }

  return tags;
};