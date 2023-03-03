import Article from '@/components/Article';
import { BlogTag, getAllTags } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import { GetStaticProps } from 'next';
import Link from 'next/link';

interface PageProps {
  tags: BlogTag[];
}

export default function Page({ tags }: PageProps) {
  return (
    <div>
      <h1>All Tags</h1>
      {tags.map((tag) => (
        <Article key={tag.slug}>
          <Article.Header>{tag.name}</Article.Header>
          <Article.Body>
            <p>
              Joined at <time>{toReadableDate(tag.createdAt)}</time>
            </p>
          </Article.Body>
          <Article.Footer>
            <Link href={`/tag/${tag.slug}`}>See all posts tagged with {tag.name}</Link>
          </Article.Footer>
        </Article>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const tags = await getAllTags('local');

  return {
    props: {
      tags,
    },
  };
};

Page.getSeo = function getSeo(props: PageProps) {
  return {
    title: 'All Tags',
    description: 'All tags on this blog',
  };
};
