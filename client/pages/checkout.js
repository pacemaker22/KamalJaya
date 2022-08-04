import React, { useEffect, useState } from "react";
import { Button, Col, ListGroup, Row, Card, Container } from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";

import useRequest from "../hooks/use-request";
import CheckoutSteps from "../components/cart/checkoutStep";
import NextImage from "../components/common/NextImage";
import Message from "../components/common/Message";

const checkout = ({ currentUser }) => {
	const [cart, setCart] = useState(null);
	const [alamatKirim, setAlamatKirim] = useState(null);
	const [metodePembayaran, setMetodePembayaran] = useState(null);
	const [onSuccess, setOnSuccess] = useState(false);
	const [storageReady, setStorageReady] = useState(false);

	let hargaItem;
	let ongkir;
	let hargaTotal;

	const { doRequest, errors } = useRequest({
		url: `/api/orders`,
		method: "post",
		body: {
			jsonCartItems: JSON.stringify(cart),
			jsonAlamatKirim: JSON.stringify(alamatKirim),
			jsonMetodePembayaran: JSON.stringify(metodePembayaran),
		},
		onSuccess: (order) => {
			setOnSuccess(true);
			Router.push(`/orders/${order.id}`);
		},
	});

	useEffect(() => {
		// Protect unauthorized access
		if (!currentUser) {
			return Router.push("/signin");
		}

		const cartItemsData = localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [];

		const shippingData = localStorage.getItem("alamatKirim")
			? JSON.parse(localStorage.getItem("alamatKirim"))
			: [];

		const paymentData = localStorage.getItem("metodePembayaran")
			? JSON.parse(localStorage.getItem("metodePembayaran"))
			: [];

		// Cart has items or empty
		if (
			cartItemsData !== undefined &&
			shippingData !== undefined &&
			paymentData !== undefined
		) {
			cartItemsData.map((item) => {
				item.userId = currentUser.id;
			});

			// Set cart state to cartItems in localStorage
			setCart(cartItemsData);
			setAlamatKirim(shippingData);
			setMetodePembayaran(paymentData);

			// Start render the page
			setStorageReady(true);
		}

		if (onSuccess) {
			localStorage.setItem("cartItems", []);
		}
	}, [onSuccess]);

	if (cart && storageReady) {
		hargaItem = Number(
			cart.reduce((acc, item) => acc + item.price * item.qty * item.discount, 0)
		).toFixed(2);
		ongkir = 0,
		totalharga = (
			Number(hargaItem) +
			Number(ongkir)
		).toFixed(2);
	}

	const checkoutHandler = (e) => {
		e.preventDefault();
		doRequest();
	};

	return (
			<>
				<Head>
					<title>Checkout | Aurapan</title>
				</Head>
				{storageReady && (
					<Container className="app-container">
						<CheckoutSteps
							step1
							step2
							step3
							step4
							currentStep={"/checkout"}
							currentUser={currentUser}
						/>
						<Row>
							<Col md={8} className="mb-3">
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h3>Shipping</h3>
										<p>
											<strong>Nama: </strong>{" "}
											{currentUser?.nama ? currentUser.nama : currentUser.id}
										</p>
										<p>
											<strong>Email: </strong>

											<Link href={`mailto:${currentUser.email}`} passHref>
												<a>{currentUser.email}</a>
											</Link>
										</p>
										<p className="mb-0">
											<strong>Address: </strong>
											{alamatKirim.alamat} {alamatKirim.kota},{" "}
											{alamatKirim.kodePos}
										</p>
									</ListGroup.Item>

									<ListGroup.Item>
										<h3>Metode Pembayaran</h3>
										<p>
											<strong>Metode: </strong>
											<span className="text-uppercase">{metodePembayaran}</span>
										</p>
									</ListGroup.Item>

									<ListGroup.Item>
										<h3>Order Items</h3>
										{cart.length === 0 ? (
											<Message>Keranjang anda kosong</Message>
										) : (
											<ListGroup variant="flush">
												{cart.map((item, index) => (
													<ListGroup.Item key={index} id="cart-items">
														<Row>
															<Col md={2} xs={4} className="px-0">
																<Link
																	href={`/products/[productId]`}
																	as={`/products/${item.produkId}`}
																	passHref
																>
																	<div className="px-0 cart-img">
																		<NextImage
																			src={item.gambar}
																			alt={item.nama}
																			priority={true}
																			quality={50}
																		/>
																	</div>
																</Link>
															</Col>

															<Col md={10} xs={8}>
																<Row>
																	<Col
																		md={8}
																		className="mb-3 d-flex flex-column"
																	>
																		<Link
																			href={`/products/[productId]`}
																			as={`/products/${item.produkId}`}
																		>
																			<a className="cart-product-title mb-1">
																				{item.nama}
																			</a>
																		</Link>

																		<h6>
																			<strong>COLOR:</strong>{" "}
																			{item.color === null ? (
																				<p style={{ color: "red" }}>
																					Warna belum dipilih
																				</p>
																			) : (
																				item.color
																			)}
																		</h6>

																		<h6>
																			<strong>SIZE:</strong>{" "}
																			{item.size === null ? (
																				<p style={{ color: "red" }}>
																					Ukuran Belum Dipilih
																				</p>
																			) : (
																				item.size
																			)}
																		</h6>
																	</Col>

																	<Col md={4}>
																		{item.qty} x ${item.harga} =
																		$
																		{(
																			item.qty *
																			item.harga 
																		).toFixed(2)}
																	</Col>
																</Row>
															</Col>
														</Row>
													</ListGroup.Item>
												))}
											</ListGroup>
										)}
									</ListGroup.Item>
								</ListGroup>
							</Col>

							<Col md={4}>
								<Card>
									<ListGroup variant="flush">
										<ListGroup.Item>
											<h3>Daftar Order</h3>
										</ListGroup.Item>

										<ListGroup.Item>
											<Row>
												<Col>
													<strong>Items</strong>
												</Col>
												<Col>${hargaItem ? hargaItem : "N/A" }</Col>
											</Row>
										</ListGroup.Item>

										<ListGroup.Item>
											<Row>
												<Col>
													<strong>Shipping</strong>
												</Col>
												<Col>${ongkir ? ongkir : "N/A" }</Col>
											</Row>
										</ListGroup.Item>

										<ListGroup.Item>
											<Row>
												<Col>
													<strong>Total</strong>
												</Col>
												<Col>${hargaTotal ? hargaTotal : "N/A" }</Col>
											</Row>
										</ListGroup.Item>

										{errors}
										<ListGroup.Item className="d-grid gap-2">
											<Button
												type="button"
												variant="dark"
												disabled={cart.length === 0}
												onClick={checkoutHandler}
											>
												Checkout
											</Button>
										</ListGroup.Item>
									</ListGroup>
								</Card>
							</Col>
						</Row>
					</Container>
				) }
			</>
	);
};

export default checkout;
