export interface IConfig {
  site: {
    name: string;
    description: string;
    url: string;
    image: string;
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
    description: 'A unstyled blog built with Next.js.',
    url: 'https://unstyled-next-blog.vercel.app/',
    image: '',
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
    ],
  },
} as IConfig;
