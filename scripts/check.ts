import * as fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import slugify from 'slugify';

type TPostError = {
  message: string;
  type:
    | 'CORRUPT'
    | 'NOT_EXISTS'
    | 'NO_FRONTMATTER'
    | 'NO_NAME'
    | 'NO_DESCRIPTION'
    | 'NO_IMAGE'
    | 'NO_AUTHOR'
    | 'NO_TAG'
    | 'NO_CONTENT'
    | 'EMPTY_NAME'
    | 'EMPTY_DESCRIPTION'
    | 'EMPTY_AUTHOR_NAME'
    | 'EMPTY_TAG_NAME';
  resource: 'post';
  filePath: string;
};

type TAuthorError = {
  message: string;
  type: 'CORRUPT' | 'NOT_EXISTS' | 'NO_NAME' | 'NO_DESCRIPTION' | 'NO_IMAGE';
  resource: 'author';
  filePath: string;
};

type TTagError = {
  message: string;
  type: 'CORRUPT' | 'NOT_EXISTS' | 'NO_NAME' | 'NO_DESCRIPTION' | 'NO_IMAGE';
  resource: 'tag';
  filePath: string;
};

type TStaticPageError = {
  message: string;
  type:
    | 'CORRUPT'
    | 'NOT_EXISTS'
    | 'NO_FRONTMATTER'
    | 'NO_NAME'
    | 'NO_DESCRIPTION'
    | 'NO_IMAGE'
    | 'EMPTY_NAME'
    | 'EMPTY_DESCRIPTON'
    | 'NO_CONTENT';
  resource: 'static-page';
  filePath: string;
};

type TError = TPostError | TAuthorError | TTagError | TStaticPageError;

function prettyPrintError(error: TError) {
  console.log(`
    Type: ${error.type}
    Message: ${error.message}
    Resource: ${error.resource}
    File: ${error.filePath}
  `);
}

async function getAllAuthors() {
  const authors = await fs.readdir(path.resolve(__dirname, '..', '_content', 'authors'));
  return authors.map((author) => author.replace('.json', ''));
}

async function getAllTags() {
  const tags = await fs.readdir(path.resolve(__dirname, '..', '_content', 'tags'));
  return tags.map((tag) => tag.replace('.json', ''));
}

async function getAllPosts() {
  const posts = await fs.readdir(path.resolve(__dirname, '..', '_content', 'posts'));
  return posts;
}

async function getAllStaticPages() {
  const posts = await fs.readdir(path.resolve(__dirname, '..', '_content', 'pages'));
  return posts;
}

async function checkPost(slug: string, errors: TError[]) {
  const requiredFields = ['name', 'description', 'image', 'authors', 'tags'];

  const filePath = path.resolve(__dirname, '..', '_content', 'posts', slug, 'index.mdx');
  const contents = await fs.readFile(filePath);

  const returnValue = {
    authors: [],
    tags: [],
  };

  let frontmatter = null;
  try {
    frontmatter = matter(contents.toString());
  } catch {
    errors.push({
      message: 'Frontmatter could not be parsed',
      type: 'CORRUPT',
      resource: 'post',
      filePath,
    });
    return { authors: [], tags: [] };
  }

  if (!frontmatter.data) {
    errors.push({
      message: 'Frontmatter could not be found',
      type: 'NO_FRONTMATTER',
      resource: 'post',
      filePath,
    });
  } else {
    requiredFields.forEach((field) => {
      if (!(field in frontmatter.data)) {
        errors.push({
          message: `'${field}' could not be found in the frontmatter`,
          type: `NO_${field.toUpperCase()}` as TPostError['type'],
          resource: 'post',
          filePath,
        });
      }
    });
  }

  if ('authors' in frontmatter.data) {
    if (!Array.isArray(frontmatter.data.authors)) {
      errors.push({
        message: 'Authors must be an array',
        type: 'NO_AUTHOR',
        resource: 'post',
        filePath,
      });
    } else {
      if (frontmatter.data.authors.length === 0) {
        errors.push({
          message: 'At least one author must be specified',
          type: 'NO_AUTHOR',
          resource: 'post',
          filePath,
        });
      }

      for (const author of frontmatter.data.authors) {
        if (author === '') {
          errors.push({
            message: 'Author cannot be empty',
            type: 'EMPTY_AUTHOR_NAME',
            resource: 'post',
            filePath,
          });
        } else {
          returnValue.authors.push(author);
        }
      }
    }
  }

  if ('tags' in frontmatter.data) {
    if (!Array.isArray(frontmatter.data.tags)) {
      errors.push({
        message: 'Tags must be an array',
        type: 'NO_TAG',
        resource: 'post',
        filePath,
      });
    } else {
      if (frontmatter.data.tags.length === 0) {
        errors.push({
          message: 'At least one tag must be specified',
          type: 'NO_TAG',
          resource: 'post',
          filePath,
        });
      }

      for (const tag of frontmatter.data.tags) {
        if (tag === '') {
          errors.push({
            message: 'Tag cannot be empty',
            type: 'EMPTY_TAG_NAME',
            resource: 'post',
            filePath,
          });
        } else {
          returnValue.tags.push(tag);
        }
      }
    }
  }

  if (!frontmatter.content) {
    errors.push({
      message: 'Content could not be found',
      type: 'NO_CONTENT',
      resource: 'post',
      filePath,
    });
  }

  return returnValue;
}

async function checkAuthor(name: string, errors: TError[]) {
  const requiredFields = ['name', 'description', 'image'];

  const slug = slugify(name, { lower: true });
  const filePath = path.resolve(__dirname, '..', '_content', 'authors', `${slug}.json`);
  const isExists = await fs.pathExists(filePath);

  if (!isExists) {
    errors.push({
      resource: 'author',
      filePath,
      message: `Author file for '${name}' (${slug}.json) could not be found`,
      type: 'NOT_EXISTS',
    });
    return;
  }

  let contents = null;
  try {
    contents = await fs.readJSON(filePath);
  } catch {
    errors.push({
      resource: 'author',
      filePath,
      message: 'Author file could not be parsed',
      type: 'CORRUPT',
    });
    return;
  }

  requiredFields.forEach((field) => {
    if (!(field in contents)) {
      errors.push({
        resource: 'author',
        filePath,
        message: `'${field}' could not be found in the author file`,
        type: `NO_${field.toUpperCase()}` as TAuthorError['type'],
      });
    }
  });
}

async function checkTag(name: string, errors: TError[]) {
  const requiredFields = ['name', 'description', 'image'];

  const slug = slugify(name, { lower: true });
  const filePath = path.resolve(__dirname, '..', '_content', 'tags', `${slug}.json`);
  const isExists = await fs.pathExists(filePath);

  if (!isExists) {
    errors.push({
      resource: 'tag',
      filePath,
      message: `Tag file for '${name}' (${slug}.json) could not be found`,
      type: 'NOT_EXISTS',
    });
    return;
  }

  let contents = null;
  try {
    contents = await fs.readJSON(filePath);
  } catch {
    errors.push({
      resource: 'tag',
      filePath,
      message: 'Tag file could not be parsed',
      type: 'CORRUPT',
    });
    return;
  }

  requiredFields.forEach((field) => {
    if (!(field in contents)) {
      errors.push({
        resource: 'tag',
        filePath,
        message: `'${field}' could not be found in the author file`,
        type: `NO_${field.toUpperCase()}` as TAuthorError['type'],
      });
    }
  });
}

async function checkPage(slug: string, errors: TError[]) {
  const requiredFields = ['name', 'description', 'image'];

  const filePath = path.resolve(__dirname, '..', '_content', 'pages', slug, 'index.mdx');
  const contents = await fs.readFile(filePath);

  let frontmatter = null;
  try {
    frontmatter = matter(contents.toString());
  } catch {
    errors.push({
      message: 'Frontmatter could not be parsed',
      type: 'CORRUPT',
      resource: 'static-page',
      filePath,
    });
    return;
  }

  if (!frontmatter.data) {
    errors.push({
      message: 'Frontmatter could not be found',
      type: 'NO_FRONTMATTER',
      resource: 'static-page',
      filePath,
    });
  } else {
    requiredFields.forEach((field) => {
      if (!(field in frontmatter.data)) {
        errors.push({
          message: `'${field}' could not be found in the frontmatter`,
          type: `NO_${field.toUpperCase()}` as TStaticPageError['type'],
          resource: 'static-page',
          filePath,
        });
      }
    });
  }

  if (!frontmatter.content) {
    errors.push({
      message: 'Content could not be found',
      type: 'NO_CONTENT',
      resource: 'static-page',
      filePath,
    });
  }
}

async function main() {
  const posts = await getAllPosts();
  const authors = await getAllAuthors();
  const tags = await getAllTags();
  const staticPages = await getAllStaticPages();

  console.log(`Found ${posts.length + authors.length + tags.length + staticPages.length} files to check.`);

  const requiredAuthors = new Set<string>();
  const requiredTags = new Set<string>();

  const errors: TError[] = [];

  for (const post of posts) {
    const { authors, tags } = await checkPost(post, errors);
    authors.forEach((author) => requiredAuthors.add(author));
    tags.forEach((tag) => requiredTags.add(tag));
  }

  for (const author of Array.from(requiredAuthors)) {
    await checkAuthor(author, errors);
  }

  for (const tag of Array.from(requiredTags)) {
    await checkTag(tag, errors);
  }

  for (const page of staticPages) {
    await checkPage(page, errors);
  }

  if (errors.length > 0) {
    console.log(`Oops, found ${errors.length} errors.`);
    errors.forEach((error) => prettyPrintError(error));
  } else {
    console.log('Well, everything looks good! :)');
  }
}

main();
