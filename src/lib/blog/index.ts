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
  return await selectedAdapter.getAllPosts();
};

export const getPostBySlug = async (
  adapter: BlogAdapter,
  slug: string
): Promise<BlogPost> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getPostBySlug(slug);
};

export const getPostsByTag = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogPost[]> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getPostsByTag(name);
};

export const getPostsByAuthor = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogPost[]> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getPostsByAuthor(name);
};

export const getAllAuthors = async (
  adapter: BlogAdapter
): Promise<BlogAuthor[]> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getAllAuthors();
};

export const getAuthorByName = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogAuthor> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getAuthorByName(name);
};

export const getAllTags = async (adapter: BlogAdapter): Promise<BlogTag[]> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getAllTags();
};

export const getTagByName = async (
  adapter: BlogAdapter,
  name: string
): Promise<BlogTag> => {
  const selectedAdapter = getAdapter(adapter);
  return await selectedAdapter.getTagByName(name);
};

const getAdapter = (adapter: BlogAdapter): IBlogAdapter => {
  switch (adapter) {
    case 'local':
      return LocalAdapter;
    default:
      return LocalAdapter;
  }
};
