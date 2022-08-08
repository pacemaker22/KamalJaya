import React, { useEffect, useState } from "react";

import mobileNavbar from "./mobileNavbar"
import desktopNavbar from "./desktopNavbar";
import useWindowSize from "../../hooks/useWindowSize";

const Header = ({ currentUser, produk }) => {
	const [numItems, setNumItems] = useState(0);
	const [showNotification, setShowNotification] = useState(false);
	const [onMobile, setOnMobile] = useState(true);

	const { width } = useWindowSize();

	// All category on the website
	const produkKategori = ["Top", "Bottom", "Dress", "Set", "Coat"];

	useEffect(() => {
		// Update cart item number every 0.1 second
		const interval = setInterval(() => {
			// Initial retrieve data from localStorage
			const cartItems = localStorage.getItem("cartItems")
				? JSON.parse(localStorage.getItem("cartItems"))
				: [];

			if (cartItems.length !== 0) {
				setShowNotification(true);
				setNumItems(cartItems.length);
			} else if (cartItems.length === 0 || !cartItems) {
				setShowNotification(false);
				setNumItems(0);
			}
		}, 100);

		if (width <= 992) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}

		return () => clearInterval(interval);
	}, [width, currentUser]);

	return onMobile ? (
		<mobileNavbar
			currentUser={currentUser}
			numItems={numItems}
			showNotification={showNotification}
			produkKategori={produkKategori}
		/>
	) : (
		<desktopNavbar
			currentUser={currentUser}
			produk={produk}
			numItems={numItems}
			showNotification={showNotification}
			produkKategori={produkKategori}
		/>
	);
};

export default Header;
