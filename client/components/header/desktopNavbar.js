import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

import akunDropdown from "./akunDropdown";
import kategoriDropdown from "./kategoriDropdown";

const desktopNavbar = ({
	currentUser,
	produkToko,
	bestseller,
	numItems,
	showNotification,
	productCategories,
}) => {
	const [eventTarget, setEventTarget] = useState(null);
	const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);
	const [showAccountDropDown, setShowAccountDropDown] = useState(false);

	return (
		<header>
			<Navbar
				variant="light"
				expand="lg"
				collapseOnSelect="true"
				className="py-0"
			>
				<Container
					className="menu-container d-flex flex-row"
					onMouseLeave={() => setShowAccountDropDown(false)}
				>
					<Link href="/" passHref>
						<Navbar.Brand className="header-logo text-uppercase">
							Kamal Jaya
						</Navbar.Brand>
					</Link>

					<Nav
						className="sub-menu"
						onMouseLeave={() => setShowCategoryDropDown(false)}
					>
						{productCategories.map((kategori, index) => (
							<Link
								href={`/produk/${kategori.toLowerCase()}${
									kategori === "Dress" ? "es" : "s"
								}`}
								key={index}
								passHref
							>
								<Nav.Link
									onMouseEnter={(e) => {
										setEventTarget(e.target);
										setShowCategoryDropDown(true);
									}}
								>
									{kategori}
								</Nav.Link>
							</Link>
						))}
					</Nav>

					<Nav className="icon-menu d-flex flex-row position-relative">
						<Link href="/cart" passHref>
							<Nav.Link className="cart-icon">
								<FontAwesomeIcon icon={faBasketShopping} /> Cart
								<span
									id="notification"
									className="position-absolute badge border border-light rounded-circle bg-danger"
									style={{ display: showNotification ? "block" : "none" }}
								>
									<span className="visually-hidden">Pesan yang belum dibaca</span>
									{numItems}
								</span>
							</Nav.Link>
						</Link>

						<Link href={currentUser ? "/dashboard" : "/signin"} passHref>
							<Nav.Link
								className="account-icon"
								onMouseEnter={() =>
									currentUser
										? setShowAccountDropDown(true)
										: setShowAccountDropDown(false)
								}
							>
								<FontAwesomeIcon icon={faCircleUser} /> Akun
							</Nav.Link>
						</Link>

						<akunDropdown
							currentUser={currentUser}
							showAccountDropDown={showAccountDropDown}
							setShowAccountDropDown={setShowAccountDropDown}
						/>
					</Nav>
				</Container>
			</Navbar>

			<kategoriDropdown
				eventTarget={eventTarget}
				showCategoryDropDown={showCategoryDropDown}
				setShowCategoryDropDown={setShowCategoryDropDown}
				produkToko={produkToko}
				bestseller={bestseller}
			/>
		</header>
	);
};

export default desktopNavbar;
