import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import * as ga from "../../lib/ga";

const tambahKeranjang = ({
	produk,
	currentUser,
	warna,
	ukuran,
	kuantitas = 1,
	lg = false,
}) => {
	const [onAdd, setOnAdd] = useState(false);
	const [loadingAddToCart, setLoadingAddToCart] = useState(false);
	const [text, setText] = useState("Tambah Ke Keranjang");
	const [query, setQuery] = useState("");

	useEffect(() => {
		// Initial retrieve data from localStorage
		let cartItems = localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [];

		if (onAdd) {
			// Create new item to push in cart array then stored in localStorage
			const newItem = {
				userId: currentUser?.id || null,
				title: produk.title,
				kuantitas: kuantitas,
				warna: warna || null,
				ukuran: ukuran || null,
				gambar: produk.gambarItem.image1,
				harga: produk.harga,
				jumlahStock: produk.jumlahStock - kuantitas,
				produkId: produk.id,
			};

			// Check if the produk exist in cart
			const existItem = cartItems.find((item) => item.produkId === produk.id);

			// If it existed, replace it with new data
			if (existItem) {
				cartItems = cartItems.map((item) =>
					item.produkId === existItem.produkId ? newItem : item
				);
			} else {
				cartItems.push(newItem);
			}

			localStorage.setItem("cartItems", JSON.stringify(cartItems));
			setOnAdd(false);

			setTimeout(() => {
				setLoadingAddToCart(false);
				setText("Ditambahkan!");
			}, 500);

			setTimeout(() => {
				setText("Tambah Ke Keranjang");
			}, 2000);
		}

		return () => setText("Tambah Ke Keranjang");
	}, [onAdd]);

	const addToCartHandler = (e) => {
		setQuery(e.target.value);
		e.preventDefault();
		setLoadingAddToCart(true);
		setOnAdd(true);
		ga.event({
			action: "Tambah Ke Keranjang",
			params: {
				add_to_cart_term: query,
			},
		});
	};

	return (
		<Button
			as="div"
			className={lg ? "add-to-cart-btn-lg" : "add-to-cart-btn"}
			variant="outline-dark"
			onClick={addToCartHandler}
			disabled={produk.jumlahStock < 1}
		>
			{loadingAddToCart ? (
				<Spinner
					animation="border"
					role="status"
					as="span"
					size="sm"
					aria-hidden="true"
				>
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			) : (
				<>{text}</>
			)}
		</Button>
	);
};

export default tambahKeranjang;
