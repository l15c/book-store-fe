// next
import Head from 'next/head';
// auth
import GuestGuard from '../../auth/GuestGuard';
// sections
import AdminLogin from '../../sections/@admin/Login';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function AdminLoginPage() {
  return (
    <>
      <Head>
        <title>Nhân viên | Book Shop</title>
      </Head>

      <GuestGuard>
        <AdminLogin />
      </GuestGuard>
    </>
  );
}
