import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const getProduk = ({ produk }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      jsonCartItems,
      jsonAlamatKirim,
      jsonMetodePembayaran

    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{produk.nama}</h1>
      <h4>Harga: {produk.harga}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Beli      
      </button>
    </div>
  );
};

getProduk.getInitialProps = async (context, client) => {
  const { produkId } = context.query;
  const { data } = await client.get(`/api/produk/${produkId}`);

  return { produk: data };
};

export default getProduk;