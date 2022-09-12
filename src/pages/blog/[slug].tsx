import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { BlogPost, getAllPosts, getPostBySlug } from '../../lib/blog';
import { toReadableDate } from '../../lib/utils/date';

interface BlogSlugPageProps {
  post: BlogPost;
}

const BlogSlugPage: NextPage<BlogSlugPageProps> = ({
  post,
}: BlogSlugPageProps) => {
  return (
    <article>
      <header>
        <h1>{post.name}</h1>
        <p>{post.description}</p>
        <p>
          Written by{' '}
          <span>{post.authors.map((author) => author.name).join(', ')}.</span>
        </p>
        <p>
          This post is tagged with {post.tags.map((tag) => tag.name).join(', ')}
          .
        </p>
      </header>
      <section
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />
      <footer>
        <p>
          Published at <time>{toReadableDate(post.createdAt)}</time> and updated
          at <time>{toReadableDate(post.updatedAt)}</time>.
        </p>
      </footer>
    </article>
  );
};

export const getStaticProps: GetStaticProps<
  BlogSlugPageProps,
  Params
> = async ({ params }) => {
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
    params: { slug: post.name },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default BlogSlugPage;
