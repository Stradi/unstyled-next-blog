import Article from '@/components/Article';
import { BlogAuthor, getAllAuthors } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import { GetStaticProps } from 'next';
import Link from 'next/link';

interface PageProps {
  authors: BlogAuthor[];
}

export default function Page({ authors }: PageProps) {
  return (
    <div>
      <h1>All Authors</h1>
      {authors.map((author) => (
        <Article key={author.slug}>
          <Article.Header>{author.name}</Article.Header>
          <Article.Body>
            <p>
              Joined at <time>{toReadableDate(author.createdAt)}</time>
            </p>
          </Article.Body>
          <Article.Footer>
            <Link href={`/author/${author.slug}`}>See all posts by {author.name}</Link>
          </Article.Footer>
        </Article>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const authors = await getAllAuthors('local');

  return {
    props: {
      authors,
    },
  };
};

Page.getSeo = function getSeo(props: PageProps) {
  return {
    title: 'All Authors',
    description: 'All authors on this blog',
  };
};
