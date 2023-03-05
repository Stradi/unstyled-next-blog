import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { BlogPost, getAllPosts, getPostBySlug } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import Article from '@/components/Article';
import MDXRenderer from '@/components/MDXRenderer';

interface PageProps {
  post: BlogPost;
}

export default function Page({ post }: PageProps) {
  return (
    <Article>
      <Article.Header>
        <h1>{post.name}</h1>
        <p>{post.description}</p>
        <p>
          Written by <span>{post.authors.map((author) => author.name).join(', ')}.</span>
        </p>
        <p>This post is tagged with {post.tags.map((tag) => tag.name).join(', ')}.</p>
      </Article.Header>
      <Article.Body>
        <MDXRenderer content={post.content} />
      </Article.Body>
      <Article.Footer>
        <p>
          Published at <time>{toReadableDate(post.createdAt)}</time> and updated at{' '}
          <time>{toReadableDate(post.updatedAt)}</time>.
        </p>
      </Article.Footer>
    </Article>
  );
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async ({ params }) => {
  const post = await getPostBySlug('local', params.slug);

  return {
    props: {
      post,
    },
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const allPosts = await getAllPosts('local');
  const paths = allPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

Page.getSeo = function getSeo(props: PageProps) {
  return {
    title: props.post.name,
    description: props.post.description,
  } as TPageSeo;
};
