export interface IConfig {
  site: {
    name: string;
    url: string;
    image: string;
    defaultSeo: TPageSeo;
  };
  navigation: {
    items: {
      label: string;
      href: string;
      icon?: string;
    }[];
  };
}

export default {
  site: {
    name: 'Unstyled Next Blog',
    url: 'https://unstyled-next-blog.vercel.app',
    image: '',
    defaultSeo: {
      title: 'Unstyled Next Blog',
      titleTemplate: '%s | Unstyled Next Blog',
      description: 'A unstyled blog built with Next.js.',
      noindex: false,
      nofollow: false,
      twitter: {
        cardType: 'summary_large_image',
        site: '@unstyled-next-blog',
        handle: '@unstyled-next-blog',
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
      },
    },
  },
  navigation: {
    items: [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'Search',
        href: '/search',
      },
    ],
  },
} as IConfig;
