import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import tambahKeranjang from "../common/tambahKeranjang";
import warnaSelector from "../common/warnaSelector"

const produk = ({
	onMobile,
	produk,
	currentUser,
	isMobileStyle = false,
	showAddToCart = true,
	showColors = true,
	priority = false,
}) => {
	const [color, setColor] = useState(null);
	const [toggle, setToggle] = useState(false);

	const colorSelectedHandler = (color) => {
		if (color !== null) {
			setColor(color);
		}
	};

	const myLoader = ({ src, quality }) => {
		const isCloudinary = src.includes('aurapan');
		if (isCloudinary) {
			return `https://res.cloudinary.com/thasup/image/upload/${src}`;
		} else {
			return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 20}`;
		}
	};

	return (
		<Card className="mb-3 produk-card">
			<div
				className="produk-img"
				onMouseEnter={() => setToggle(true)}
				onMouseLeave={() => setToggle(false)}
				onTouchStart={toggle ? () => setToggle(false) : () => setToggle(true)}
			>
				<Link
					href={`/produk/[produkId]`}
					as={`/produk/${produk.id}`}
					passHref
				>
					<Card.Body
						className="produk-img__cover"
						style={{ opacity: toggle ? "0" : "1" }}
					>
						<Image
							loader={myLoader}
							src={product.images.image1}
							layout="fill"
							objectFit="cover"
							lazyBoundary={onMobile ? "400px" : "800px"}
							priority={priority || false}
							alt={`${product.title} image 1`}
						/>
					</Card.Body>
				</Link>

				<Link
					href={`/produk/[produkId]`}
					as={`/produk/${produk.id}`}
					passHref
				>
					<Card.Body
						className="product-img__hover"
						style={{ opacity: toggle ? "1" : "0" }}
					>
						<Image
							loader={myLoader}
							src={produk.gambarItem.gambar2}
							layout="fill"
							objectFit="cover"
							lazyBoundary={onMobile ? "400px" : "800px"}
							priority={priority || false}
							alt={`${produk.nama} image 2`}
						/>
					</Card.Body>
				</Link>

				{showAddToCart && !onMobile && (
					<div className="menu-tab" style={{ opacity: toggle ? "1" : "0" }}>
						<tambahKeranjang
							produk={produk}
							currentUser={currentUser}
							color={color}
						/>
					</div>
				)}
			</div>

			<Card.Body className="px-2 pb-0">
				<Row
					className="d-flex justify-content-between px-0 mx-0"
					style={{
						flexDirection: isMobileStyle ? "column" : (onMobile ? "column" : "row"),
						minHeight: isMobileStyle ? "5.25rem" : (onMobile ? "5.25rem" : "4rem"),
					}}
				>
					<Col xs={12} sm={9} className="card-produk-title" as="h4"
						style={{
							fontSize: isMobileStyle ? "1.1rem" : (onMobile && "1.1rem"),
							minHeight: isMobileStyle ? "3rem" : (onMobile && "3rem"),
						}}
					>
						<Link
							href={`/produk/[produkId]`}
							as={`/produk/${produk.id}`}
							passHref
						>
							<a>{produk.nama}</a>
						</Link>
					</Col>

					<Col xs={12} sm={3} className="card-produk-price"
						style={{
							textAlign: isMobileStyle ? "start" : (onMobile ? "start" : "end"),
							justifyContent: isMobileStyle ? "flex-end" : (onMobile ? "flex-end" : "flex-start"),
						}}
					>
						<h4
							style={{
								fontSize: isMobileStyle ? "1.2rem" : (onMobile && "1.2rem")
							}}
						>
							${produk.harga}
						</h4>
					</Col>
				</Row>

				<Row className="d-flex flex-row justify-content-end align-items-center px-0 mx-0">
					{showColors && (
						<Col xs={7} className="card-product-color" as="div">
							<warnaSelector
								produk={produk}
								callback={colorSelectedHandler}
								margin={"2px"}
								size={onMobile ? "15px" : "25px"}
								flex={"end"}
							/>
						</Col>
					)}
				</Row>

				{showAddToCart && onMobile && (
					<tambahKeranjang
						className="d-flex justify-content-center"
						produk={produk}
						currentUser={currentUser}
						color={color}
						lg={true}
					/>
				)}
			</Card.Body>
		</Card>
	);
};

export default produk;
