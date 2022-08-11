import Link from 'next/link';

const LandingPage = ({ currentUser, produkToko }) => {
  const produkList = produkToko.map((produk) => {
    return (
      <tr key={produk.id}>
        <td>{produk.nama}</td>
        <td>{produk.harga}</td>
        <td>{produk.jumlahStok}</td>
        <td>{produk.kategori}</td>
        <td>{produk.deskripsi}</td>
        <td>{produk.gambar1}</td>
        <td>
          <Link href='/produk/[produkId]' as={`/produk/${produk.id}`}>
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
  return { produkToko: data };
}
export default LandingPage;