import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";

import produk from "../../../components/home/produk";
import Loader from "../../../components/common/Loader";
import useWindowSize from "../../../hooks/useWindowSize";

const alatTulisBaru = ({ produkToko, currentUser }) => {
	const [loading, setLoading] = useState(true);
	const [onMobile, setOnMobile] = useState(false);

	const { width } = useWindowSize();

	const alatTulisBaru = produkToko
		?.filter((alatTulis) => alatTulis.kategori === "Alat Tulis")
		.reverse();

	useEffect(() => {
		if (width <= 576) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}

		if (produkToko && alatTulisBaru) {
			setLoading(false);
		}
	}, [width, produkToko]);

	return (
		<>
			<Head>
				<title>New Arrivals Bottoms | Aurapan</title>
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
					<h1 className="category-header">Produk Alat Tulis</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/produk/alatTulis" passHref>
							<Breadcrumb.Item>Alat Tulis</Breadcrumb.Item>
						</Link>
                        <Link href="/produk/alatTulis/new" passHref>
							<Breadcrumb.Item>New Arrivals</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{alatTulisBaru.map((item) => (
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

export default alatTulisBaru;
