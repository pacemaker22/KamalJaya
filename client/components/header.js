import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Daftar', href: '/user/daftar' },
    !currentUser && { label: 'Masuk', href: '/user/masuk' },
    currentUser && { label: 'Jual Produk', href: '/produk/buatDaftarProduk' },
    currentUser && { label: 'My Orders', href: '/order' },
    currentUser && { label: 'Keluar', href: '/user/keluar' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Kamal Jaya</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};