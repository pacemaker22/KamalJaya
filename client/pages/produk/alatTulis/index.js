import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";

import Loader from "../../../components/common/Loader";
import produk from '../../../components/home/produk'
import useWindowSize from "../../../hooks/useWindowSize";

const alatTulis = ({ produkToko, currentUser }) => {
	const [loading, setLoading] = useState(true);
	const [onMobile, setOnMobile] = useState(false);

	const { width } = useWindowSize();

	const alatTulis = produkToko?.filter((Produk) => Produk.kategori === "Alat Tulis");

	useEffect(() => {
		if (width <= 576) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}

		if (produkToko) {
			setLoading(false);
		}
	}, [width, produkToko]);

	return (
		<>
			<Head>
				<title>Alat Tulis | Kamal Jaya</title>
			</Head>
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center px-0"
					style={{ marginTop: "80px" }}
				>
					<Loader />
				</div>
			) : (
				<>
					<h1 className="category-header">Alat Tulis</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/produk/alatTulis" passHref>
							<Breadcrumb.Item>Alat Tulis</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{alatTulis.map((item) => (
							<Col key={item.id} xs={6} md={4} xl={3} className="p-0">
								<produk
									onMobile={onMobile}
									Produk={item}
									currentUser={currentUser}
								/>
							</Col>
						))}
					</Row>
				</>
			)}
		</>
	);
};

export default alatTulis;
