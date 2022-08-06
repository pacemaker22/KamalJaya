import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Router from "next/router";
import Head from "next/head";

import FormContainer from "../components/common/FormContainer";
import CheckoutSteps from "../components/cart/checkoutStep";

const pengiriman = ({ currentUser }) => {
	const [alamat, setAlamat] = useState(null);
	const [kota, setKota] = useState(null);
	const [kodePos, setKodePos] = useState(null);

	const [onSubmit, setOnSubmit] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [storageReady, setStorageReady] = useState(false);

	useEffect(() => {
		// Protect unauthorized access
		if (!currentUser) {
			return Router.push("/signin");
		} else {
			setIsReady(true);
		}

		const data = localStorage.getItem("alamatKirim")
			? JSON.parse(localStorage.getItem("alamatKirim"))
			: [];

		if (currentUser?.alamatKirim) {
			// Set state to shippingAddress data in profile information
			setAlamat(currentUser?.alamatKirim.alamat);
			setKota(currentUser?.alamatKirim.kota);
			setKodePos(currentUser?.alamatKirim.kodePos);

			setStorageReady(true);
		} else if (data !== undefined) {
			// Set state to shippingAddress data in localStorage
			setAlamat(data.alamat);
			setKota(data.kota);
			setKodePos(data.kodePos);
			setCountry(data.country);

			// Start render the page
			setStorageReady(true);
		}

		const shippingAddress = {
			address: address,
			kota: kota,
			kodePos: kodePos,
		};

		if (onSubmit) {
			localStorage.setItem("alamatKirim", JSON.stringify(alamatKirim));

			setOnSubmit(false);
			Router.push("/payment");
		}
	}, [onSubmit]);

	const submitHandler = (e) => {
		e.preventDefault();
		setOnSubmit(true);
	};

	return (
		isReady && (
			<>
				<Head>
					<title>Alamat Pengiriman</title>
				</Head>
				{storageReady ? (
					<FormContainer>
						<CheckoutSteps
							step1
							step2
							currentStep={"/pengiriman"}
							currentUser={currentUser}
						/>
						<h1>Pengiriman</h1>
						<Form onSubmit={submitHandler}>
							<Form.Group controlId="alamat" className="my-3">
								<Form.Label>Alamat</Form.Label>
								<Form.Control
									type="text"
									placeholder="Masukan alamat"
									value={alamat}
									required
									onChange={(e) => setAlamat(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId="kota" className="my-3">
								<Form.Label>kota</Form.Label>
								<Form.Control
									type="text"
									placeholder="Masukan kota"
									value={kota}
									required
									onChange={(e) => setKota(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId="kodePos" className="my-3">
								<Form.Label>Kode Pos</Form.Label>
								<Form.Control
									type="text"
									placeholder="Masukan Kode pos"
									value={kodePos}
									required
									onChange={(e) => setKodePos(e.target.value)}
								></Form.Control>
							</Form.Group>
							<Button type="submit" variant="dark">
								Lanjut
							</Button>
						</Form>
					</FormContainer>
				) : null}
			</>
		)
	);
};

export default pengiriman;
