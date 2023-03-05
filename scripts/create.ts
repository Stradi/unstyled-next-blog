import path from 'path';
import fs from 'fs-extra';

import _argv from 'minimist';
import slugify from 'slugify';
import prompts, { PromptObject } from 'prompts';

const argv = _argv(process.argv.slice(2));

const POST_TEMPLATE = `---
name: '{name}'
description: ''
image:
  src: ''
  alt: ''
authors:
  - ''
tags:
  - ''
---

# {name}
`;

const AUTHOR_TEMPLATE = `{
  "$schema": "../_schemas/author.schema.json",
  "name": "{name}",
  "description": "",
  "image": {
    "src": "",
    "alt": ""
  }
}`;

const TAG_TEMPLATE = `{
  "$schema": "../_schemas/tag.schema.json",
  "name": "{name}",
  "description": "",
  "image": {
    "src": "",
    "alt": ""
  }
}`;

const STATIC_PAGE_TEMPLATE = `---
name: '{name}'
description: ''
image:
  src: ''
  alt: ''
---

# {name}
`;

type TQuestions = {
  [key: string]: prompts.PromptObject[];
};

const questions: TQuestions = {
  type: [
    {
      type: 'select',
      name: 'type',
      message: 'What do you want to create?',
      choices: [
        { title: 'Blog Post', value: 'post' },
        {
          title: 'Author',
          value: 'author',
        },
        {
          title: 'Tag',
          value: 'tag',
        },
        {
          title: 'Static Page',
          value: 'page',
        },
      ],
    },
  ],
  post: [
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of your blog post?',
    },
  ],
  author: [
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of the author?',
    },
  ],
  tag: [
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of the tag?',
    },
  ],
  page: [
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of the static page?',
    },
  ],
};

async function promptQuestions(questions: PromptObject[]) {
  const response = await prompts(questions, {
    onCancel: () => {
      console.log('Aborted!');
      process.exit(1);
    },
  });
  return response;
}

async function isResourceExists(type: 'post' | 'author' | 'tag' | 'page', slug: string) {
  switch (type) {
    case 'author':
      return (await getAllAuthors()).includes(slug);
    case 'tag':
      return (await getAllTags()).includes(slug);
    case 'post':
      return (await getAllPosts()).includes(slug);
    case 'page':
      return (await getAllStaticPages()).includes(slug);
    default:
      return false;
  }
}

async function createFile(path: string, content: string) {
  await fs.ensureFile(path);
  await fs.writeFile(path, content);
}

async function createResource(type: 'post' | 'author' | 'tag' | 'page', name: string) {
  function encode(str: string) {
    return str.replace(/'/g, "''");
  }

  const slug = slugify(name, { lower: true, strict: true });
  let filePath = path.resolve(__dirname, '..', '_content', `${type}s`);

  const content = {
    post: POST_TEMPLATE.replace(/{name}/g, encode(name)),
    author: AUTHOR_TEMPLATE.replace(/{name}/g, encode(name)),
    tag: TAG_TEMPLATE.replace(/{name}/g, encode(name)),
    page: STATIC_PAGE_TEMPLATE.replace(/{name}/g, encode(name)),
  };

  if (type === 'post' || type === 'page') {
    filePath = path.resolve(filePath, slug, `index.mdx`);
  } else {
    filePath = path.resolve(filePath, `${slug}.json`);
  }

  await createFile(filePath, content[type]);
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
  const pages = await fs.readdir(path.resolve(__dirname, '..', '_content', 'pages'));
  return pages;
}

async function main() {
  if (!argv.type) {
    const response = await promptQuestions(questions.type);
    argv.type = response.type;
  }
  const response = await promptQuestions(questions[argv.type]);
  const slug = slugify(response.name, { lower: true, strict: true });

  if (await isResourceExists(argv.type, slug)) {
    console.error(`Looks like there is already a ${argv.type} with the name '${response.name}' exists.`);
    process.exit(1);
  }

  console.log(`Creating ${argv.type} '${response.name}'...`);
  await createResource(argv.type, response.name);
  console.log('Done!');
}

main();
