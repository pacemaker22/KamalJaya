import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel } from "react-bootstrap";

import Loader from "../common/Loader";

const customCarousel = ({ gambarItem, quality }) => {
	const [index, setIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [imageArray, setImageArray] = useState([]);

	useEffect(() => {
		if (gambarItem || reload) {
			setImageArray(gambarItem);

			setLoading(false);
		}
	}, [gambarItem]);

	const myLoader = ({ src, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/pacemaker/image/upload/${src}`;
		} else {
			return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 50}`;
		}
	};

	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};

	return loading ? (
		<>
			<Loader />
		</>
	) : (
		<Carousel
			className="carousel-produk-parent"
			variant="dark"
			interval={null}
			activeIndex={index}
			onSelect={handleSelect}
		>
			{imageArray.map((gambar, index) => (
				<Carousel.Item key={index} className="carousel-produk-item">
					<Image
						loader={myLoader}
						src={gambar === "" ? "gatmu67f52etjy2/4te4tet.webp" : gambar}
						alt={`gambar produk ${index}`}
						layout="fill"
						objectFit="cover"
						quality={quality}
						priority
					/>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default customCarousel;
