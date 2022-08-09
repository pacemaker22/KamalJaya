import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const daftar = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
      nama,
      foto: "",
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className='container'>
    <form onSubmit={onSubmit}>
      <h1>Masukan email,nama dan password anda</h1>
      <div className='form-group'>
      <label>Nama</label>
      <input
       type="text"
       value={nama}
       onChange={e => setNama(e.target.value)}
       className="form-control" 
      />
      </div>
      <div className="form-group">
        <label>Alamat Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button
       className="btn btn-primary mt-2">Masuk</button>
    </form>
    </div>
  );
};

export default daftar;