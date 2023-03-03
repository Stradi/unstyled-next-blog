import fs from 'fs-extra';
import path from 'path';
import { BlogAuthor, BlogPost, BlogTag } from '.';
import {
  convertToMarkdown,
  getFileWithDetails,
  moveImagesToPublicFolder,
  moveImageToPublicFolder,
} from '@/lib/utils/file';
import { slugify } from '@/lib/utils/slugify';

const CONTENT_DIR = path.resolve(process.cwd(), '_content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const AUTHORS_DIR = path.join(CONTENT_DIR, 'authors');
const TAGS_DIR = path.join(CONTENT_DIR, 'tags');

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(POSTS_DIR);
  const posts = [];

  for (const file of files) {
    posts.push(await getPostBySlug(file));
  }

  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const markdownFilePath = path.join(POSTS_DIR, slug, 'index.md');

  await moveImagesToPublicFolder(POSTS_DIR, slug);

  const fileDetails = await getFileWithDetails(markdownFilePath, true);

  const renderableMarkdown = await convertToMarkdown(fileDetails.content, slug);
  const authors = await populateAuthors(fileDetails.frontmatter.authors);
  const tags = await populateTags(fileDetails.frontmatter.tags);

  return {
    name: fileDetails.frontmatter.name,
    slug,
    description: fileDetails.frontmatter.description,
    createdAt: new Date(fileDetails.details.birthtime),
    updatedAt: new Date(fileDetails.details.mtime),
    content: renderableMarkdown,
    image: {
      src: `/images/blog/${slug}/${fileDetails.frontmatter.image.src}`,
      alt: fileDetails.frontmatter.image.alt,
    },
    authors,
    tags,
  } as BlogPost;
}

export async function getPostsByTag(name: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.some((tag) => tag.name === name));
}

export async function getPostsByAuthor(name: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.authors.some((author) => author.name === name));
}

export async function getAllAuthors(): Promise<BlogAuthor[]> {
  const files = await fs.readdir(AUTHORS_DIR);
  const authors = [];

  for (const file of files) {
    const ext = path.extname(file);
    if (ext !== '.json') continue;

    const filename = path.basename(file, ext);

    authors.push(await getAuthorBySlug(filename));
  }

  return authors;
}

export async function getAuthorByName(name: string): Promise<BlogAuthor> {
  const slug = slugify(name);
  const filePath = path.join(AUTHORS_DIR, `${slug}.json`);

  const fileDetails = await getFileWithDetails(filePath, false);
  const json = JSON.parse(fileDetails.content);
  delete json['$schema'];

  if (json.image.src !== '') {
    moveImageToPublicFolder('authors', `${path.join(AUTHORS_DIR, json.image.src)}`);
  }

  return {
    name: json.name,
    slug,
    description: json.description,
    createdAt: fileDetails.details.birthtime,
    updatedAt: fileDetails.details.mtime,
    image: {
      src: `/images/authors/${json.image.src}`,
      alt: json.image.alt,
    },
  } as BlogAuthor;
}

export async function getAuthorBySlug(slug: string): Promise<BlogAuthor> {
  const filePath = path.join(AUTHORS_DIR, `${slug}.json`);

  const fileDetails = await getFileWithDetails(filePath, false);
  const json = JSON.parse(fileDetails.content);
  delete json['$schema'];

  if (json.image.src !== '') {
    moveImageToPublicFolder('authors', `${path.join(AUTHORS_DIR, json.image.src)}`);
  }

  return {
    name: json.name,
    slug,
    description: json.description,
    createdAt: fileDetails.details.birthtime,
    updatedAt: fileDetails.details.mtime,
    image: {
      src: `/images/authors/${json.image.src}`,
      alt: json.image.alt,
    },
  } as BlogAuthor;
}

export async function getAllTags(): Promise<BlogTag[]> {
  const files = await fs.readdir(TAGS_DIR);
  const tags = [];

  for (const file of files) {
    const ext = path.extname(file);
    if (ext !== '.json') continue;

    const filename = path.basename(file, ext);

    tags.push(await getTagBySlug(filename));
  }

  return tags;
}

export async function getTagByName(name: string): Promise<BlogTag> {
  const slug = slugify(name);
  const filePath = path.join(TAGS_DIR, `${slug}.json`);

  const fileDetails = await getFileWithDetails(filePath, false);
  const json = JSON.parse(fileDetails.content);
  delete json['$schema'];

  if (json.image.src !== '') {
    moveImageToPublicFolder('tags', `${path.join(TAGS_DIR, json.image.src)}`);
  }

  return {
    name: json.name,
    slug,
    description: json.description,
    createdAt: fileDetails.details.birthtime,
    updatedAt: fileDetails.details.mtime,
    image: {
      src: `/images/tags/${json.image.src}`,
      alt: json.image.alt,
    },
  } as BlogTag;
}

export async function getTagBySlug(slug: string): Promise<BlogTag> {
  const filePath = path.join(TAGS_DIR, `${slug}.json`);

  const fileDetails = await getFileWithDetails(filePath, false);
  const json = JSON.parse(fileDetails.content);
  delete json['$schema'];

  if (json.image.src !== '') {
    moveImageToPublicFolder('tags', `${path.join(TAGS_DIR, json.image.src)}`);
  }

  return {
    name: json.name,
    slug,
    description: json.description,
    createdAt: fileDetails.details.birthtime,
    updatedAt: fileDetails.details.mtime,
    image: {
      src: `/images/tags/${json.image.src}`,
      alt: json.image.alt,
    },
  } as BlogTag;
}

async function populateAuthors(names: string[]): Promise<BlogAuthor[]> {
  const authors = [];

  for (const name of names) {
    const slug = slugify(name);
    authors.push(await getAuthorByName(slug));
  }

  return authors;
}

async function populateTags(names: string[]): Promise<BlogTag[]> {
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    tags.push(await getTagByName(slug));
  }

  return tags;
}
