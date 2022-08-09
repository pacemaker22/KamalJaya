import Link from 'next/link';
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Anda berhasil login</h1>
  ) : (
    <h1>Anda belum login</h1>
  )
}

LandingPage.getInitialProps = async (context,client, currentUser) => {
  return {};
}
export default LandingPage;