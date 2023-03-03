import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import '@/styles/reset.css';
import { NextPage } from 'next';
import Head from 'next/head';
import config from '@/config';
import { getRobots, getTitle } from '@/lib/utils/seo';
import { usePathname } from 'next/navigation';

type NextPageWithSEO = NextPage & {
  getSeo?: (props: any) => TPageSeo;
};

type AppPropsWithSEO = AppProps & {
  Component: NextPageWithSEO;
};

export default function App({ Component, pageProps }: AppPropsWithSEO) {
  const getSeo = Component.getSeo || (() => config.site.defaultSeo);
  const seo = {
    ...config.site.defaultSeo,
    ...getSeo(pageProps),
  };

  const pathname = usePathname();
  const currentUrl = `${config.site.url}${pathname}`;

  return (
    <Layout>
      <Head>
        {seo.title && <title>{getTitle(seo)}</title>}
        {seo.title && <meta property="og:title" content={seo.title} />}
        {seo.title && <meta name="twitter:title" content={seo.title} />}

        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:url" content={currentUrl} />

        {seo.description && <meta name="description" content={seo.description} />}
        {seo.description && <meta property="og:description" content={seo.description} />}
        {seo.description && <meta name="twitter:description" content={seo.description} />}

        {seo.twitter.cardType && <meta name="twitter:card" content={seo.twitter.cardType} />}
        {seo.twitter.site && <meta name="twitter:site" content={seo.twitter.site} />}
        {seo.twitter.handle && <meta name="twitter:creator" content={seo.twitter.handle} />}

        {seo.openGraph.type && <meta property="og:type" content={seo.openGraph.type} />}
        {seo.openGraph.locale && <meta property="og:locale" content={seo.openGraph.locale} />}
        <meta property="og:site_name" content={config.site.name} />

        <meta name="robots" content={getRobots(seo)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
