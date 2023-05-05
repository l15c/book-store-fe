// next
import Head from 'next/head';
// layouts
import AdminLayout from 'src/layouts/admin';
// sections
import { Chat } from '../../../sections/@admin/chat';

// ----------------------------------------------------------------------

ChatPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <>
      <Head>
        <title> Chat | Minimal UI</title>
      </Head>

      <Chat />
    </>
  );
}
