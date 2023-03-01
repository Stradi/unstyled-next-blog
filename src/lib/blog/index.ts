import * as LocalAdapter from './local.adapter';

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
  image: BlogImage;
}

export interface BlogTag extends BlogResource {
  image: BlogImage;
}

export interface BlogPost extends BlogResource {
  content: string;
  image: BlogImage;
  authors: BlogAuthor[];
  tags: BlogTag[];
}

export type BlogAdapter = 'local';

export interface IBlogAdapter {
  getAllPosts: () => Promise<BlogPost[]>;
  getPostBySlug: (slug: string) => Promise<BlogPost>;
  getPostsByTag: (tag: string) => Promise<BlogPost[]>;
  getPostsByAuthor: (author: string) => Promise<BlogPost[]>;
  getAllAuthors: () => Promise<BlogAuthor[]>;
  getAuthorByName: (name: string) => Promise<BlogAuthor>;
  getAllTags: () => Promise<BlogTag[]>;
  getTagByName: (name: string) => Promise<BlogTag>;
}

export async function getAllPosts(adapter: BlogAdapter): Promise<BlogPost[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllPosts();
  return serializeAsJSON<BlogPost[]>(result);
}

export async function getPostBySlug(
  adapter: BlogAdapter,
  slug: string
): Promise<BlogPost> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostBySlug(slug);
  return serializeAsJSON<BlogPost>(result);
}

export async function getPostsByTag(
  adapter: BlogAdapter,
  name: string
): Promise<BlogPost[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostsByTag(name);
  return serializeAsJSON<BlogPost[]>(result);
}

export async function getPostsByAuthor(
  adapter: BlogAdapter,
  name: string
): Promise<BlogPost[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostsByAuthor(name);
  return serializeAsJSON<BlogPost[]>(result);
}

export async function getAllAuthors(
  adapter: BlogAdapter
): Promise<BlogAuthor[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllAuthors();
  return serializeAsJSON<BlogAuthor[]>(result);
}

export async function getAuthorByName(
  adapter: BlogAdapter,
  name: string
): Promise<BlogAuthor> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAuthorByName(name);
  return serializeAsJSON<BlogAuthor>(result);
}

export async function getAllTags(adapter: BlogAdapter): Promise<BlogTag[]> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllTags();
  return serializeAsJSON<BlogTag[]>(result);
}

export async function getTagByName(
  adapter: BlogAdapter,
  name: string
): Promise<BlogTag> {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getTagByName(name);
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
