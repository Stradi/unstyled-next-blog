import config from '@/config';

export interface FooterProps extends React.ComponentPropsWithoutRef<'footer'> {}

export default function Footer({ ...rest }: FooterProps) {
  const siteName = config.site.name;
  return <footer {...rest}>© 2022 {siteName}.</footer>;
}
