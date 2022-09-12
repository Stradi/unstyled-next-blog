import SiteConfig from '../../../config/Site.config';

export interface FooterProps extends React.ComponentPropsWithoutRef<'footer'> {}

const Footer = ({ ...rest }: FooterProps) => {
  const siteName = SiteConfig.siteName;
  return <footer {...rest}>© 2022 {siteName}.</footer>;
};

export { Footer };
