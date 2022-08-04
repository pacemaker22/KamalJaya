import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Breadcrumb } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import Loader from "../../components/common/Loader";
import NextImage from "../../components/common/NextImage";
import produkImageSwiper from "../../components/produk/produkImageSwiper"
import warnaSelector from "../../components/common/warnaSelector";
import deskripsiProduk from "../../components/produk/deskripsiProduk"
import tambahKeranjang from "../../components/common/tambahKeranjang"
import kuantitasSelector from "../../components/common/kuantitasSelector"
import useWindowSize from "../../hooks/useWindowSize";

const productDetail = ({ produkToko, users, currentUser, myOrders }) => {
	const { produkId } = useRouter().query;
	const [kuantitas, setKuantitas] = useState(1);
	const [warna, setWarna] = useState(null);
	const [gambarAwal, setGambarAwal] = useState(false);
	const [gambarArray, setGambarArray] = useState([]);
	const [eventGambar, setEventGambar] = useState(null);
	const [onMobile, setOnMobile] = useState(false);


	const produk = produkToko.find((produk) => produk.id === produkId);
	const kategoriParam = `${produk?.kategori.toLowerCase()}${produk?.kategori === "Dress" ? "es" : "s"
		}`;

	const { width } = useWindowSize();

	useEffect(() => {

		if (width <= 576) {
			setOnMobile(true);
		} else {
			setGambarAwal(false);
			setOnMobile(false);
		}
	}, [width]);

	useEffect(async () => {
		//Check if orders is not an empty array
		if (myOrders && myOrders.length !== 0) {
			// Check if user can write a review after purchased the product
			const hasPurchasedItem = await myOrders.map((order) => {
				if (order.isBayar === true) {
					return order.cart.some((item) => item.produkId === produkId);
				}
				return false;
			});
		}

		// Defined variable
		const mainImage = document.getElementsByClassName("produk-main-img");
		const sideImage = document.getElementsByClassName("produk-side-img");

		// Toggle the first image to show as a main image
		// when page load at first time on desktop screen
		if (!gambarAwal && !onMobile) {
			for (let i = 0; i < mainImage.length; i++) {
				mainImage[i].classList.remove("toggle-main-img");
				sideImage[i].classList.remove("toggle-side-img");
			}

			mainImage[0].classList.add("toggle-main-img");
			setGambarAwal(true);
		}

		// Toggle 'toggle-main-img' class for image when user clicked on that side image
		if (eventGambar) {
			for (let i = 0; i < mainImage.length; i++) {
				mainImage[i].classList.remove("toggle-main-img");
				sideImage[i].classList.remove("toggle-side-img");
			}

			const currentId =
				eventGambar.target.parentElement.parentElement.id.slice(-1);

			mainImage[currentId].classList.add("toggle-main-img");

			eventGambar.target.parentElement.parentElement.classList.add(
				"toggle-side-img"
			);

			// Set image event to default
			setEventGambar(null);
		}

		// Limit kuantitas input by locked maximum and minimum from the produk jumlahStok
		if (kuantitas > produk.jumlahStok) {
			setKuantitas(produk.jumlahStok);
		} else if (kuantitas < 1) {
			setKuantitas(1);
		}
	}, [produk, gambarAwal, eventGambar, kuantitas]);

	if (gambarArray.length === 0 && produk) {
		const filterGambar = Object.values(produk.gambarItem).filter(
			(gambar) => gambar !== null && gambar !== ""
		);

		setGambarArray(filterGambar);
	}

	useEffect(() => {
		// Re-evaluate new filter gambarItem when the produk had changed
		if (produk) {
			const filterGambar = Object.values(produk?.gambarItem).filter(
				(gambar) => gambar !== null && gambar !== ""
			);

			setGambarArray(filterGambar);
			if (gambarAwal) {
				setGambarAwal(false);
			}
		}
	}, [produk]);

	const warnaSelectorHandler = (warna) => {
		if (warna !== null) {
			setWarna(warna);
		}
	};
	return (
		<>
			<Head>
				<title>{produk.title} | Aurapan</title>
			</Head>
			<div className="breadcrumb-label">
				{!produk.id || produk.id !== produkId ? (
					<div
						className="d-flex justify-content-center align-items-center px-0"
						style={{ marginTop: "80px" }}
					>
						<Loader />
					</div>
				) : (
					<>
						<Breadcrumb className="pt-4">
							<Link href="/" passHref>
								<Breadcrumb.Item>Home</Breadcrumb.Item>
							</Link>

							<Link href={`/produk/${kategoriParam}`} passHref>
								<Breadcrumb.Item>{produk.kategori}</Breadcrumb.Item>
							</Link>

							<Link
								href="/produk/[produkId]"
								as={`/produk/${produk.id}`}
								passHref
							>
								<Breadcrumb.Item>{produk.title}</Breadcrumb.Item>
							</Link>
						</Breadcrumb>

						<Row id="produk-page">
							{onMobile ? (
								<Col className="mb-3">
									<produkImageSwiper produk={produk} />
								</Col>
							) : (
								<>
									<Col sm={1} className="mb-3">
										{gambarArray.map((img, index) => (
											<div
												className="produk-side-img"
												id={`side-img-${index}`}
												key={index}
												onClick={(e) => setEventGambar(e)}
											>
												<NextImage
													src={img}
													alt={`produk_image_${index}`}
													priority={true}
													quality={30}
												/>
											</div>
										))}
									</Col>

									<Col sm={5} className="mb-3 position-relative">
										{gambarArray.map((img, index) => (
											<div className="produk-main-img" key={index}>
												<NextImage
													src={img}
													alt={`produk_image_${index}`}
													priority={true}
													quality={75}
												/>
											</div>
										))}
									</Col>
								</>
							)}

							<Col sm={6}>
								<ListGroup variant="flush" className="mb-3">

									<ListGroup.Item>
										<h1>{produk.nama}</h1>
									</ListGroup.Item>

									<ListGroup.Item>
										<h1 className="produk-price">$ {produk.price}</h1>
									</ListGroup.Item>

									<ListGroup.Item>
										<h3>Warna</h3>
										<div className="my-1 px-0">
											<warnaSelector
												produk={produk}
												callback={warnaSelectorHandler}
												margin={"5px"}
												size={"2rem"}
												flex={"start"}
											/>
										</div>
									</ListGroup.Item>

									<ListGroup.Item>
										<h3>QTY</h3>
										<kuantitasSelector
											produk={produk}
											kuantitas={kuantitas}
											setKuantitas={setKuantitas}
										/>
									</ListGroup.Item>

									<ListGroup.Item>
										<div className="produk-desc my-1 px-0">
											<p>{produk.deskripsi}</p>
										</div>
									</ListGroup.Item>
								</ListGroup>

								<Card className="produk-page-box">
									<ListGroup>
										<ListGroup.Item>
											<Row>
												<Col>
													<h5>Status:</h5>
												</Col>
												<Col>
													<h6>
														{produk.jumlahStok > 0
															? "Ready Stok"
															: "Stok Habis"}
													</h6>
												</Col>
											</Row>
										</ListGroup.Item>

										<ListGroup.Item>
											<Row>
												<Col>
													<h5>Kategori:</h5>
												</Col>
												<Col>
													<h6>{produk.kategori}</h6>
												</Col>
											</Row>
										</ListGroup.Item>
										{produk.jumlahStok}

										<ListGroup.Item className="d-grid">
											<tambahKeranjang
												produk={produk}
												currentUser={currentUser}
												warna={warna}
												kuantitas={kuantitas}
												lg={onMobile ? true : false}
											/>
										</ListGroup.Item>
									</ListGroup>
								</Card>
							</Col>
						</Row>

						<Row className="mt-4 pb-5">
							<Col sm={6} className="mb-3">
								<div className="px-0 mt-2">
									<deskripsiProduk produk={produk} />
								</div>
							</Col>
						</Row>
					</>
				)}
			</div>
		</>
	);
};

export default productDetail;
