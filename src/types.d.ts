type TPageSeo = Partial<{
  titleTemplate: string;
  title: string;
  noindex: boolean;
  nofollow: boolean;
  description: string;
  canonical: string;
  image: string | false;
  twitter: {
    cardType: 'summary' | 'summary_large_image' | 'app' | 'player';
    site: string;
    handle: string;
  };
  openGraph: {
    type: 'website' | 'article' | 'profile';
    locale: string;
  };
}>;
