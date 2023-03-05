import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAllStaticPages, getStaticPageBySlug, StaticPage } from '@/lib/blog';
import { toReadableDate } from '@/lib/utils/date';
import Article from '@/components/Article';
import MDXRenderer from '@/components/MDXRenderer';

interface PageProps {
  page: StaticPage;
}

export default function Page({ page }: PageProps) {
  return (
    <Article>
      <Article.Header>
        <h1>{page.name}</h1>
        <p>{page.description}</p>
      </Article.Header>
      <Article.Body>
        <MDXRenderer content={page.content} />
      </Article.Body>
      <Article.Footer>
        <p>
          Published at <time>{toReadableDate(page.createdAt)}</time> and updated at{' '}
          <time>{toReadableDate(page.updatedAt)}</time>.
        </p>
      </Article.Footer>
    </Article>
  );
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async ({ params }) => {
  const page = await getStaticPageBySlug('local', params.slug[0]);

  return {
    props: {
      page,
    },
  };
};

interface Params extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const allPages = await getAllStaticPages('local');
  const paths = allPages.map((page) => ({
    params: { slug: [page.slug] },
  }));

  return {
    paths,
    fallback: false,
  };
};

Page.getSeo = function getSeo(props: PageProps) {
  return {
    title: props.page.name,
    description: props.page.description,
  } as TPageSeo;
};
