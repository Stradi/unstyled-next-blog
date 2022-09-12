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

export const getAllPosts = async (
  adapter: BlogAdapter
): Promise<BlogPost[]> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllPosts();
  return serializeAsJSON<BlogPost[]>(result);
};

export const getPostBySlug = async (
  adapter: BlogAdapter,
  slug: string
): Promise<BlogPost> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostBySlug(slug);
  return serializeAsJSON<BlogPost>(result);
};

export const getPostsByTag = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogPost[]> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostsByTag(name);
  return serializeAsJSON<BlogPost[]>(result);
};

export const getPostsByAuthor = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogPost[]> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getPostsByAuthor(name);
  return serializeAsJSON<BlogPost[]>(result);
};

export const getAllAuthors = async (
  adapter: BlogAdapter
): Promise<BlogAuthor[]> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllAuthors();
  return serializeAsJSON<BlogAuthor[]>(result);
};

export const getAuthorByName = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogAuthor> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAuthorByName(name);
  return serializeAsJSON<BlogAuthor>(result);
};

export const getAllTags = async (adapter: BlogAdapter): Promise<BlogTag[]> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getAllTags();
  return serializeAsJSON<BlogTag[]>(result);
};

export const getTagByName = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogTag> => {
  const selectedAdapter = getAdapter(adapter);
  const result = await selectedAdapter.getTagByName(name);
  return serializeAsJSON<BlogTag>(result);
};

const getAdapter = (adapter: BlogAdapter): IBlogAdapter => {
  switch (adapter) {
    case 'local':
      return LocalAdapter;
    default:
      return LocalAdapter;
  }
};

const serializeAsJSON = <T>(data: any): T => {
  return JSON.parse(JSON.stringify(data));
};
