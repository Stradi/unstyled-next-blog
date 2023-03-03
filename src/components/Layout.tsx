import Breadcrumb from './Breadcrumb';
import Footer from './Footer';
import Header from './Header';

export interface LayoutProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Layout({ children, ...rest }: LayoutProps) {
  return (
    <>
      <Header />
      <Breadcrumb />
      <section {...rest}>{children}</section>
      <Footer />
    </>
  );
}
