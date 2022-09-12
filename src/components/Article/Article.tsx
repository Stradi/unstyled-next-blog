import Link from 'next/link';
import { BlogPost } from '../../lib/blog';

export interface ArticleProps
  extends React.ComponentPropsWithoutRef<'article'> {
  post: BlogPost;
}

const Article = ({ post, ...rest }: ArticleProps) => {
  return (
    <article {...rest}>
      <header>
        <h2>{post.name}</h2>
      </header>
      <p>
        {post.description} <Link href={`/blog/${post.slug}`}>Read more</Link>
      </p>
      <footer>
        <p>Posted by {post.authors.map((author) => author.name).join(', ')}.</p>
        <p>
          Published at <time>{post.createdAt.toString()}</time>.
        </p>
      </footer>
    </article>
  );
};

export { Article };
