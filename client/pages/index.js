import Link from 'next/link';

const LandingPage = ({ currentUser, produk }) => {
  const produkList = produk.map((produkToko) => {
    return (
      <tr key={produkToko.id}>
        <td>{produkToko.nama}</td>
        <td>{produkToko.harga}</td>
        <td>
          <Link href='/produk/[produkId]' as={`/produk/${produkToko.id}`}>
            <a>Lihat</a>
          </Link>
        </td>
      </tr>
    )
  });
  return (
    <div>
      <h2>Produk</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Harga</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{produkList}</tbody>
      </table>
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/produk')
  return { produk: data };
}
export default LandingPage;