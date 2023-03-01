import Footer from './Footer';
import Header from './Header';

export interface LayoutProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Layout({ children, ...rest }: LayoutProps) {
  return (
    <>
      <Header />
      <section {...rest}>{children}</section>
      <Footer />
    </>
  );
}
