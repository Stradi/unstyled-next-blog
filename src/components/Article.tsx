import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';

export interface ArticleProps
  extends React.ComponentPropsWithoutRef<'article'> {
  post: BlogPost;
}

export default function Article({ post, ...rest }: ArticleProps) {
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
          Published at <time>{toReadableDate(post.createdAt)}</time>.
        </p>
      </footer>
    </article>
  );
}
