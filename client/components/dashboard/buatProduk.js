import React, { useState } from "react";
import { Button, Carousel, Col, Form, Row, Spinner } from "react-bootstrap";
import Router from "next/router";
import Image from "next/image";

import useRequest from "../../hooks/use-request";

const buatProduk = () => {
	const [nama, setNama] = useState("");
	const [harga, setHarga] = useState(0);
	const [gambar1, setGambar1] = useState("");
	const [gambar2, setGambar2] = useState("");
	const [warnaItem, setWarnaItem] = useState("");
	const [ukuranItem, setUkuranItem] = useState("");
	const [kategori, setKategori] = useState("");
	const [deskripsi, setDeskripsi] = useState("");
	const [jumlahStock, setJumlahStock] = useState(0);

	const [index, setIndex] = useState(0);
	const [loadingCreate, setLoadingCreate] = useState(false);

	const { doRequest, errors } = useRequest({
		url: "/api/products",
		method: "post",
		body: {
			nama,
			harga,
			gambar1,
			gambar2,
			warnaItem,
			ukuranItem,
			kategori,
			deskripsi,
			jumlahStock,
		},
		onSuccess: () => {
			setLoadingCreate(false);
			Router.push("/");
		},
	});

	const submitHandler = async (e) => {
		e.preventDefault();
		setLoadingCreate(true);
		doRequest();
	};

	const myLoader = ({ src, width, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/thasup/image/upload/${src}`;
		} else {
			return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 70}`;
		}
	};

	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};

	return (
		<Row>
			<Col xs={12} xl={6} className="d-flex justify-content-center">
				<Carousel
					className="carousel-produk-parent"
					variant="dark"
					activeIndex={index}
					interval={null}
					onSelect={handleSelect}
				>
					<Carousel.Item className="carousel-produk-item">
						<Image
							loader={myLoader}
							src={gambar1 || "gatmu67f52etjy2/4te4tet.webp"}
							alt={`Sample Product image`}
							layout="fill"
							objectFit="cover"
							priority
						/>
					</Carousel.Item>

					<Carousel.Item className="carousel-produk-item">
						<Image
							loader={myLoader}
							src={gambar2 || "gatmu67f52etjy2/4te4tet.webp"}
							alt={`Sample Product image`}
							layout="fill"
							objectFit="cover"
							priority
						/>
					</Carousel.Item>

					<Carousel.Item className="carousel-produk-item">
						<Image
							loader={myLoader}
							src={image3 || "gatmu67f52etjy2/4te4tet.webp"}
							alt={`Sample Product image`}
							layout="fill"
							objectFit="cover"
							priority
						/>
					</Carousel.Item>

					<Carousel.Item className="carousel-produk-item">
						<Image
							loader={myLoader}
							src={image4 || "gatmu67f52etjy2/4te4tet.webp"}
							alt={`Sample Product image`}
							layout="fill"
							objectFit="cover"
							priority
						/>
					</Carousel.Item>
				</Carousel>
			</Col>

			<Col xs={12} xl={3}>
				<Form.Group controlId="gambar" className="mb-3">
					<Form.Label>Gambar 1</Form.Label>
					<Form.Control
						type="text"
						placeholder="Masukan URL gambar pertama"
						value={gambar1}
						onChange={(e) => setGambar1(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId="gambar" className="mb-3">
					<Form.Label>Gambar 2</Form.Label>
					<Form.Control
						type="text"
						placeholder="Masukan URL gambar kedua"
						value={gambar2}
						onChange={(e) => setGambar2(e.target.value)}
					></Form.Control>
				</Form.Group>
			</Col>

			<Col xs={12} xl={3}>
				{errors}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId="name" className="mb-3">
						<Form.Label>Nama Barang</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukan nama"
							value={nama}
							onChange={(e) => setNama(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="harga" className="mb-3">
						<Form.Label>Harga Barang</Form.Label>
						<Form.Control
							type="number"
							placeholder="Masukkan harga"
							value={harga}
							onChange={(e) => setHarga(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="warna" className="mb-3">
						<Form.Label>Warna</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukkan Warna Barang"
							value={warnaItem}
							onChange={(e) => setWarnaItem(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="ukuran" className="mb-3">
						<Form.Label>Ukuran</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukkan Ukuran Barang"
							value={ukuranItem}
							onChange={(e) => setUkuranItem(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="kategori" className="mb-3">
						<Form.Label>kategori</Form.Label>
						<Form.Control
							as="select"
							className="form-select"
							value={kategori}
							onChange={(e) => setKategori(e.target.value)}
						>
							<option value="">Select...</option>
							<option value="Top">Top</option>
							<option value="Bottom">Bottom</option>
							<option value="Dress">Dress</option>
							<option value="Set">Set</option>
							<option value="Coat">Coat</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId="deskripsi" className="mb-3">
						<Form.Label>deskripsi</Form.Label>
						<Form.Control
							as="textarea"
							row="8"
							placeholder="Masukan deskripsi"
							value={deskripsi}
							onChange={(e) => setDeskripsi(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="jumlahStock" className="mb-3">
						<Form.Label>Count In Stock</Form.Label>
						<Form.Control
							type="number"
							placeholder="Masukan Stock Barang"
							value={jumlahStock}
							onChange={(e) => setJumlahStock(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button type="submit" variant="dark" className="my-3">
						{loadingCreate ? (
							<Spinner
								animation="border"
								role="status"
								as="span"
								size="sm"
								aria-hidden="true"
							>
								<span className="visually-hidden">Loading...</span>
							</Spinner>
						) : null}{" "}
						Submit
					</Button>
				</Form>
			</Col>
		</Row>
	);
};

export default buatProduk;
