import { Footer } from '../Footer';
import { Header } from '../Header';

export interface LayoutProps extends React.ComponentPropsWithoutRef<'div'> {}

const Layout = ({ children, ...rest }: LayoutProps) => {
  return (
    <>
      <Header />
      <section {...rest}>{children}</section>
      <Footer />
    </>
  );
};

export { Layout };
