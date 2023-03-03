# Unstyled Next Blog

Unstyled Next Blog is a simple blog template built with one and only Next.js. It is a simple blog template that you can use to build your own blog. It is not styled, so you can style it however you want.

## Features

- Fast (just like every Next.js app)
- Local Markdown adapter
- Error checker for local Markdown adapter

<sub>I will try to find more features to add here, I promise.<sub>

## How to use

First, clone the repository. You can do this in two ways:

### 1. Clone the repository

#### 1.1. Good ol' `git clone`

Just clone the repository with `git clone`:

```bash
git clone https://www.github.com/Stradi/unstyled-next-blog.git
```

After doing that you probably want to remove the `.git` folder, so you can use your own git repository.

```bash
rm -rf .git
```

#### 1.2. `degit` way

You can also use [degit](https://github.com/Rich-Harris/degit). This is a tool that allows you to clone a repository without the `.git` folder. To use it, you can either [install](https://github.com/Rich-Harris/degit#installation) it or use `npx`:

```bash
npx degit Stradi/unstyled-next-blog
```

### 2. Installing dependencies

After cloning the repository, you need to install the dependencies with your favorite package manager.

```bash
npm install # or yarn install or pnpm install
```

After that, you can start the development server with:

```bash
npm run dev # or yarn dev or pnpm dev
```

If you want to deploy the app, you can just put your projects in a new git repository and use a service like [Vercel](https://vercel.com) or [Netlify](https://netlify.com) to deploy it.

### 3. Configuration

Unstyled Next Blog has multiple configuration files that you can use to configure the sitewide settings. The configuration files are located in `src/config/{something}.config.ts`. You can change the following things:

- `Site.config.ts` - Site-wide settings, such as siteName
- `Navigation.config.ts` - Navigation settings, like items in the navigation bar

### 4. Adding posts

You can add posts to Unstyled Next Blog in two ways:

#### 4.1. Manual way

Unstyled Next Blog uses a local Markdown adapter. This means that you can add posts by creating a folder and a Markdown file in the `_content/posts` folder.

For example if you want to add a post called `Hello World`, you need to create a folder called `hello-world` in the `_content/posts` folder. Then, you need to create a file called `index.md` in the `hello-world` folder. The `index.md` file is the actual post. You can write your post in Markdown, with frontmatter.

Here is an example of a post:

```markdown
---
name: 'Hello World'
description: 'Some description'
image:
  src: 'cover.webp'
  alt: 'Some alt text'
authors:
  - 'Jane Doe'
tags:
  - 'Hello'
  - 'World'
---

And some content.
```

By creating these files yourself, you also need to make sure if you have the required files for tags and authors. In the example above, we need to create 3 more files:

- `_content/authors/jane-doe.json` for the author named `Jane Doe`
- `_content/tags/hello.json` for the tag named `Hello`
- `_content/tags/world.json` for the tag named `World`

All of these `json` files has schemas that your editor should be able to autocomplete. These schemas are located in `_content/_schemas`.

By using these schemas an empty author or tag file will look like this:

```json
{
  "$schema": "../_schemas/[author|tag].schema.json",
  "name": "",
  "description": "",
  "image": {
    "src": "",
    "alt": ""
  }
}
```

After creating these files, you can finally view your post on the site.

Looks like a lot of work, right? Well, there is a better way.

#### 4.2. Automatic way

Unstyled Next Blog has a CLI that you can use to create posts. To use it, you just need to run the following command:

```bash
npm run create # or yarn create or pnpm create
```

This `create` command will first ask you for the type of resource you want to create.

```bash
> unstyled-next-blog@0.0.1 create
> tsx scripts/create.ts

? What do you want to create? » - Use arrow-keys. Return to submit.
>   Blog Post
    Author
    Tag
```

After that, it will ask you for the name of the resource you want to create.

```bash
> unstyled-next-blog@0.0.1 create
> tsx scripts/create.ts

√ What do you want to create? » Blog Post
? What is the name of the blog post? »
```

After you name your resource, it will just create the required files for you (in this case, it just created a file in `_content/posts/hello-world/index.md` and filled it with the default settings).

```bash
> unstyled-next-blog@0.0.1 create
> tsx scripts/create.ts

√ What do you want to create? » Blog Post
? What is the name of the blog post? ... Hello World
Creating post 'Hello World'...
Done!
```

Again, if you want to create an author or a tag, you can just run the `create` command again and select the type of resource you want to create.

P.S. These is also a `create:post`, `create:author` and `create:tag` commands. They are doing the same thing but they don't ask you to select the type of resource you want to create.

### 5. Checking for errors

Unstyled Next Blog has a little (and really sloppy written) script that checks the errors in your `_content` folder. To use it, you can just run the following command:

```bash
npm run check # or yarn check or pnpm check
```

It will check all the posts, authors and tags for errors, such as missing fields or missing files. This is useful when you create a new post but forget to create the author or tag file.

## Contributing

If you want to contribute to Unstyled Next Blog, you can just open a pull request. I will try to review it as soon as possible. If you want to add a new feature or report a bug, please open an issue first so we can discuss it.

## License

Unstyled Next Blog is licensed under the [MIT License](/LICENSE).
