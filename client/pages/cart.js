import React, { useEffect, useState } from "react";
import {
	Row,
	Col,
	ListGroup,
	Button,
	Card,
	Container,
	Form,
	Tooltip,
	OverlayTrigger,
} from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Message from "../components/common/Message";
import CheckoutSteps from "../components/cart/checkoutStep";
import NextImage from "../components/common/NextImage";

const CartPage = ({ currentUser, produkToko }) => {
	const [cart, setCart] = useState(null);
	const [warna, setWarna] = useState([]);
	const [pilihanWarna, setPilihanWarna] = useState(null);
	const [size, setUkuran] = useState([]);
	const [pilihanUkuran, setPilihanUkuran] = useState(null);
	const [produkId, setProdukId] = useState(null);
	const [deletedItemId, setDeletedItemId] = useState(null);
	const [toolTipText, setToolTipText] = useState("");

	const [storageReady, setStorageReady] = useState(false);
	const [onEdit, setOnEdit] = useState(false);
	const [onIncrease, setOnIncrease] = useState(false);
	const [onDecrease, setOnDecrease] = useState(false);
	const [onRemove, setOnRemove] = useState(false);

	useEffect(() => {
		// Get cartItems from LocalStorage
		let cartItems = localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [];

		// cartItems haves items
		if (cartItems !== undefined && cartItems !== null) {
			// Set cart state to cartItems in localStorage
			setCart(cartItems);

			// Set initial value of color and size in form-select
			const emptyColorArray = [];
			const emptySizeArray = [];
			cartItems.forEach((item) => {
				emptyColorArray.push(item.warna);
				emptySizeArray.push(item.size);
			});
			setWarna(emptyColorArray);
			setUkuran(emptyukuranArray);

			// Start render the page
			setStorageReady(true);
		}

		// Run when update an item
		if (onEdit) {
			const existItem = cartItems.find((item) => item.produkId === produkId);

			let newQty = existItem.qty;

			// Update new quantity
			if (onIncrease) {
				newQty = existItem.qty + 1;
			} else if (onDecrease) {
				newQty = existItem.qty - 1;
			}

			// Limit maximun and minimum range
			if (newQty > existItem.jumlahStock + existItem.qty) {
				newQty = existItem.jumlahStock + existItem.qty;
			} else if (newQty < 1) {
				newQty = 1;
			}

			// Update new Item
			const editedItem = {
				userId: existItem.userId,
				nama: existItem.gambar,
				qty: Number(newQty),
				warna: pilihanWarna !== null ? pilihanWarna : existItem.warna,
				ukuran: pilihanUkuran !== null ? pilihanUkuran : existItem.ukuran,
				gambar: existItem.gambar,
				harga: existItem.harga,
				jumlahStock: Number(existItem.jumlahStock + existItem.qty - newQty),
				produkId: existItem.produkId,
			};

			// If it existed, replace it with new data
			if (existItem) {
				cartItems = cartItems.map((item) =>
				item.produkId === existItem.produkId ? editedItem : item
				);
			} else {
				cartItems.push(editedItem);
			}

			// Set cartItems with updated data in localStorage
			localStorage.setItem("cartItems", JSON.stringify(cartItems));

			// Set cart with updated data in client state
			setCart(cartItems);

			// Reset parameter to default
			setPilihanWarna(null);
			setPilihanUkuran(null);
			setOnIncrease(false);
			setOnDecrease(false);
			setOnEdit(false);
		}

		// Run when delete an item
		if (onRemove) {
			cartItems = cartItems.filter((item) => item.produkId !== deletedItemId);

			localStorage.setItem("cartItems", JSON.stringify(cartItems));
			setOnRemove(false);
		}
	}, [onIncrease, onDecrease, onEdit, onRemove, currentUser]);

	const editItemHandler = (id) => {
		setProdukId(id);
		setOnEdit(true);
	};

	const removeFromCartHandler = (produkId) => {
		setDeletedItemId(produkId);
		setOnRemove(true);
	};

	const checkoutHandler = (e) => {
		e.preventDefault();
		if (!currentUser) {
			Router.push("/signin");
		} else {
			Router.push("/shipping");
		}
	};

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			{toolTipText}
		</Tooltip>
	);

	return (
		<>
			<Head>
				<title>Cart | Kamal Jaya</title>
			</Head>
			{storageReady ? (
				<Container className="app-container">
					<CheckoutSteps
						step1
						currentStep={currentUser?.id ? "/cart" : "/signin"}
						currentUser={currentUser}
					/>
					<Row>
						<Col md={8} className="mb-3">
							<h3>Shopping Cart</h3>
							{cart.length === 0 ? (
								<Message variant="secondary">
									Keranjang anda kosong{" "}
									<Link href="/">
										<a>Lanjut Belanja</a>
									</Link>
								</Message>
							) : (
								<ListGroup variant="flush">
									{cart.map((item, index) => (
										<ListGroup.Item key={index} id="cart-items">
											<Row>
												<Col md={2} xs={4}>
													<Link
														href={`/produk/[produkId]`}
														as={`/produk/${item.produkId}`}
														passHref
													>
														<div className="cart-img">
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
													<Row className="justify-content-between">
														<Col md={5} className="mb-3 d-flex flex-column">
															<Link
																href={`/produk/[produkId]`}
																as={`/produk/${item.produkId}`}
																passHref
															>
																<a className="cart-product-title mb-1">
																	{item.nama}
																</a>
															</Link>

															<div className="px-0 mt-2 d-flex justify-content-between align-items-center">
																<h6>
																	<strong>Warna:</strong>
																</h6>
																<Form.Select
																	className="my-0"
																	size="sm"
																	value={warna[index]}
																	onChange={(e) => {
																		let productColors = produkToko
																			.find(
																				(produk) =>
																				produk.id === item.produkId
																			)
																			.warnaItem.split(",");

																		let selectedIndex =
																			e.target.options.selectedIndex;

																		let c = productColors[selectedIndex - 1];

																		setPilihanWarna(c);

																		warna[index] = c;
																		setWarna(warna);
																		editItemHandler(item.produk);
																	}}
																>
																	<option value="">Pilih Warna</option>
																	{produkToko
																		.find(
																			(produk) => produk.id === item.produkId
																		)
																		.warnaItem.split(",")
																		.map((c, i) => (
																			<option key={i} value={`${c}`}>
																				{c.toUpperCase()}
																			</option>
																		))}
																</Form.Select>
															</div>

															<div className="px-0 mt-2 d-flex justify-content-between align-items-center">
																<h6>
																	<strong>Ukuran:</strong>
																</h6>
																<Form.Select
																	className="my-0"
																	size="sm"
																	value={ukuran[index]}
																	onChange={(e) => {
																		let productSizes = produkToko
																			.find(
																				(produk) =>
																				produk.id === item.produkId
																			)
																			.ukuranItem.split(",");

																		let selectedIndex =
																			e.target.options.selectedIndex;

																		let s = productSizes[selectedIndex - 1];

																		setPilihanUkuran(s);

																		size[index] = s;
																		setUkuran(size);
																		editItemHandler(item.produkId);
																	}}
																>
																	<option value="">Pilih Ukuran</option>
																	{produkToko
																		.find(
																			(produk) => produk.id === item.produkId
																		)
																		.ukuranItem.split(",")
																		.map((s, i) => (
																			<option key={i} value={`${s}`}>
																				{s}
																			</option>
																		))}
																</Form.Select>
															</div>
														</Col>
														<Col md={4}>
															<Row className="d-flex">
																<Col className="mb-3 quantity-selector d-flex flex-row align-items-center justify-content-between">
																	<div
																		className="qty-btn decrease-btn"
																		onClick={() => {
																			editItemHandler(item.produkId);
																			setOnDecrease(true);
																		}}
																	>
																		-
																	</div>
																	<div className="cart-quantity">
																		{item.qty}
																	</div>
																	<div
																		className="qty-btn increase-btn"
																		onClick={() => {
																			editItemHandler(item.produkId);
																			setOnIncrease(true);
																		}}
																	>
																		+
																	</div>
																</Col>

																<Col className="d-flex justify-content-end">
																	<Button
																		type="button"
																		variant="dark"
																		className="cart-trash-btn"
																		onClick={() =>
																			removeFromCartHandler(item.produkId)
																		}
																	>
																		<FontAwesomeIcon icon={faTrash} />
																	</Button>
																</Col>
															</Row>
														</Col>
													</Row>
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</Col>

						<Col md={4}>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h3>
											Subtotal (
											{cart.reduce((acc, item) => acc + Number(item.qty), 0)})
											items
										</h3>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Total</strong>
											</Col>
											<Col>
												$
												{cart
													.reduce(
														(acc, item) =>
															acc + item.qty * item.harga,
														0
													)
													.toFixed(2)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item className="d-grid gap-2">
										<Button
											type="button"
											variant="dark"
											disabled={cart.length === 0}
											onClick={checkoutHandler}
										>
											{currentUser?.id
												? "Proceed To Chackout"
												: "Proceed To Sign In"}
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</Container>
			) : null}
		</>
	);
};

export default CartPage;
