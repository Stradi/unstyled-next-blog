import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { BlogPost, BlogTag, getAllTags, getPostsByTag, getTagBySlug } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import Article from '@/components/Article';
import Link from 'next/link';

interface PageProps {
  posts: BlogPost[];
  tag: BlogTag;
}

export default function Page({ posts, tag }: PageProps) {
  return (
    <div>
      <h1>Posts tagged with {tag.name}</h1>
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
  const tag = await getTagBySlug('local', params.slug);
  const posts = await getPostsByTag('local', tag.name);

  return {
    props: {
      posts,
      tag,
    },
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const allTags = await getAllTags('local');
  const paths = allTags.map((tag) => ({
    params: { slug: tag.slug },
  }));

  return {
    paths,

    // Making this 'blocking' allows getStaticProps to work both with 'Society' and 'society'.
    // We most likely don't want this, so we'll leave it as 'false' for now.
    fallback: false,
  };
};

Page.getSeo = function getSeo(props: PageProps) {
  return {
    title: props.tag.name,
    description: props.tag.description,
  };
};
