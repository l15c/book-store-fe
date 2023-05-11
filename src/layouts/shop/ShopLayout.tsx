import AuthGuard from '../../auth/AuthGuard';
//
import Main from './Main';
import Header from './header';
import { Facebook } from './Facebook';

// ----------------------------------------------------------------------

type Props = {
  noAuth?: boolean;
  children?: React.ReactNode;
};

export default function ShopLayout({ children, noAuth }: Props) {
  const renderContent = () => (
    <>
      <Header />
      <Main>{children}</Main>

      <Facebook />
    </>
  );

  if (noAuth) return renderContent();

  return <AuthGuard>{renderContent()}</AuthGuard>;
}
