import Link from 'next/link';
import NavigationConfig from '../../../config/Navigation.config';
import SiteConfig from '../../../config/Site.config';

export interface HeaderProps extends React.ComponentPropsWithoutRef<'header'> {}

const Header = ({ ...rest }: HeaderProps) => {
  const navigationItems = NavigationConfig.items;
  const siteName = SiteConfig.siteName;

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
};

export { Header };
