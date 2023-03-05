import * as LocalAdapter from './local.adapter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface BlogResource {
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogImage {
  src: string;
  alt: string;
}

export interface BlogAuthor extends BlogResource {
  image: BlogImage | undefined;
}

export interface BlogTag extends BlogResource {
  image: BlogImage | undefined;
}

export interface BlogPost extends BlogResource {
  content: MDXRemoteSerializeResult;
  image: BlogImage | undefined;
  authors: BlogAuthor[];
  tags: BlogTag[];
}

export interface StaticPage extends BlogResource {
  content: MDXRemoteSerializeResult;
}

export type BlogAdapter = 'local';

export interface IBlogAdapter {
  getAllPosts: () => Promise<BlogPost[]>;
  getPostBySlug: (slug: string) => Promise<BlogPost>;
  getPostsByTag: (tag: string) => Promise<BlogPost[]>;
  getPostsByAuthor: (author: string) => Promise<BlogPost[]>;
  getAllAuthors: () => Promise<BlogAuthor[]>;
  getAuthorByName: (name: string) => Promise<BlogAuthor>;
  getAuthorBySlug: (slug: string) => Promise<BlogAuthor>;
  getAllTags: () => Promise<BlogTag[]>;
  getTagByName: (name: string) => Promise<BlogTag>;
  getTagBySlug: (slug: string) => Promise<BlogTag>;

  getAllStaticPages: () => Promise<StaticPage[]>;
  getStaticPageBySlug: (slug: string) => Promise<StaticPage>;
}

export async function getAllPosts(adapter: BlogAdapter): Promise<BlogPost[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllPosts();
  return serializeAsJSON<BlogPost[]>(result);
}

export async function getPostBySlug(adapter: BlogAdapter, slug: string): Promise<BlogPost> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostBySlug(slug);
  return serializeAsJSON<BlogPost>(result);
}

export async function getPostsByTag(adapter: BlogAdapter, name: string): Promise<BlogPost[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostsByTag(name);
  return serializeAsJSON<BlogPost[]>(result);
}

export async function getPostsByAuthor(adapter: BlogAdapter, name: string): Promise<BlogPost[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostsByAuthor(name);
  return serializeAsJSON<BlogPost[]>(result);
}

export async function getAllAuthors(adapter: BlogAdapter): Promise<BlogAuthor[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllAuthors();
  return serializeAsJSON<BlogAuthor[]>(result);
}

export async function getAuthorByName(adapter: BlogAdapter, name: string): Promise<BlogAuthor> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAuthorByName(name);
  return serializeAsJSON<BlogAuthor>(result);
}

export async function getAuthorBySlug(adapter: BlogAdapter, slug: string): Promise<BlogAuthor> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAuthorBySlug(slug);
  return serializeAsJSON<BlogAuthor>(result);
}

export async function getAllTags(adapter: BlogAdapter): Promise<BlogTag[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllTags();
  return serializeAsJSON<BlogTag[]>(result);
}

export async function getTagByName(adapter: BlogAdapter, name: string): Promise<BlogTag> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getTagByName(name);
  return serializeAsJSON<BlogTag>(result);
}

export async function getAllStaticPages(adapter: BlogAdapter): Promise<StaticPage[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllStaticPages();
  return serializeAsJSON<StaticPage[]>(result);
}

export async function getStaticPageBySlug(adapter: BlogAdapter, slug: string): Promise<StaticPage> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getStaticPageBySlug(slug);
  return serializeAsJSON<StaticPage>(result);
}

export async function getTagBySlug(adapter: BlogAdapter, slug: string): Promise<BlogTag> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getTagBySlug(slug);
  return serializeAsJSON<BlogTag>(result);
}

function getAdapter(adapter: BlogAdapter): IBlogAdapter {
  switch (adapter) {
    case 'local':
      return LocalAdapter;
    default:
      return LocalAdapter;
  }
}

function serializeAsJSON<T>(data: any): T {
  return JSON.parse(JSON.stringify(data));
}
