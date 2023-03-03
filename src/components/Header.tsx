import Link from 'next/link';
import config from '@/config';

export interface HeaderProps extends React.ComponentPropsWithoutRef<'header'> {}

export default function Header({ ...rest }: HeaderProps) {
  const navigationItems = config.navigation.items;
  const siteName = config.site.name;

  return (
    <header {...rest}>
      <nav>
        <h1>
          <Link href="/">{siteName}</Link>
        </h1>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
