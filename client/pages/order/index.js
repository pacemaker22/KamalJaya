const OrderIndex = ({ orders }) => {
    return (
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.produk.nama} - {order.status}
            </li>
          );
        })}
      </ul>
    );
  };
  
  OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
  
    return { orders: data };
  };
  
  export default OrderIndex;
  