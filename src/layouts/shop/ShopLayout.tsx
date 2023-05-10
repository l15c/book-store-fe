import Script from 'next/script';
import AuthGuard from '../../auth/AuthGuard';
//
import Main from './Main';
import Header from './header';

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

      {/* <div id="fb-root" />
      <div id="fb-customer-chat" className="fb-customerchat" /> */}
    </>
  );

  if (noAuth) return renderContent();

  return <AuthGuard>{renderContent()}</AuthGuard>;
}
