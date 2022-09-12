export interface NavigationItems {
  label: string;
  href: string;
  icon?: string;
}

export interface NavigationConfig {
  items: NavigationItems[];
}

export default {
  items: [
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
} as NavigationConfig;
