import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const buatDaftarProduk = () => {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [gambar1, setGambar1] = useState('');
  const [gambar2, setGambar2] = useState('');
  const [warna, setWarna] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahStok, setJumlahStok] = useState('');
  const { doRequest, errors } = useRequest({
    url: "/api/produk",
    method: 'post',
    body: {
      nama,
      harga,
      gambar1,
      gambar2,
      warna,
      kategori,
      deskripsi,
      jumlahStok,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Nama</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Gambar 1</label>
          <input
            type='file'
            value={gambar1}
            onChange={(e) => setGambar1(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Gambar 2</label>
          <input
            type='file'
            value={gambar2}
            onChange={(e) => setGambar2(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Warna</label>
          <input
            value={warna}
            onChange={(e) => setWarna(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Kategori</label>
          <input
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Harga</label>
          <input
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Jumlah Stok</label>
          <input
            value={jumlahStok}
            onChange={(e) => setJumlahStok(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  );
};

export default buatDaftarProduk;