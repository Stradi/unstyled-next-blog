import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import {
  BlogAuthor,
  BlogPost,
  BlogTag,
  getAllAuthors,
  getAllTags,
  getAuthorBySlug,
  getPostsByAuthor,
  getPostsByTag,
  getTagBySlug,
} from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import Article from '@/components/Article';
import Link from 'next/link';

interface PageProps {
  posts: BlogPost[];
  author: BlogAuthor;
}

export default function Page({ posts, author }: PageProps) {
  return (
    <div>
      <h1>Posts by {author.name}</h1>
      {posts.map((post) => (
        <Article key={post.slug}>
          <Article.Header>{post.name}</Article.Header>
          <Article.Body>
            {post.description} <Link href={`/blog/${post.slug}`}>Read more</Link>
          </Article.Body>
          <Article.Footer>
            <p>
              <time dateTime={post.createdAt.toString()}>{toReadableDate(post.createdAt)}</time>
            </p>
          </Article.Footer>
        </Article>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async ({ params }) => {
  const author = await getAuthorBySlug('local', params.slug);
  const posts = await getPostsByAuthor('local', author.name);

  return {
    props: {
      posts,
      author,
    },
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const allAuthors = await getAllAuthors('local');
  const paths = allAuthors.map((author) => ({
    params: { slug: author.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

Page.getSeo = function getSeo(props: PageProps) {
  return {
    title: props.author.name,
    description: props.author.description,
  };
};
