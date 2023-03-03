import Article from '@/components/Article';
import { BlogPost, getAllPosts } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import { GetStaticProps } from 'next';
import Link from 'next/link';

interface PageProps {
  posts: BlogPost[];
}

export default function Page({ posts }: PageProps) {
  return (
    <div>
      <h1>All Posts</h1>
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

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const posts = await getAllPosts('local');

  return {
    props: {
      posts,
    },
  };
};

Page.getSeo = function getSeo() {
  return {
    title: 'Blog',
    description: 'All blog posts',
  } as TPageSeo;
};
