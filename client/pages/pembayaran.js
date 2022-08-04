import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Router from "next/router";
import Head from "next/head";

import CheckoutSteps from "../components/cart/checkoutStep";
import FormContainer from "../components/common/FormContainer";

const Pembayaran = ({ currentUser }) => {
	const [metodePembayaran, setMetodePembayaran] = useState("stripe");
	const [onSubmit, setOnSubmit] = useState(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Protect unauthorized access
		if (!currentUser) {
			return Router.push("/signin");
		} else {
			setIsReady(true);
		}

		const alamatKirim = localStorage.getItem("alamatKirim")
			? JSON.parse(localStorage.getItem("alamatKirim"))
			: [];

		if (!alamatKirim.alamat) {
			Router.push("/shipping");
		}

		const data = localStorage.getItem("metodePembayaran")
			? JSON.parse(localStorage.getItem("metodePembayaran"))
			: [];

		if (data !== undefined) {
			// Set state to paymentMethod data in localStorage
			setMetodePembayaran(data);
		}

		if (onSubmit) {
			localStorage.setItem("metodePembayaran", JSON.stringify(metodePembayaran));

			setOnSubmit(false);
			Router.push("/checkout");
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
					<title>Metode Pembayaran | Kamal Jaya</title>
				</Head>
				<FormContainer>
					<CheckoutSteps
						step1
						step2
						step3
						currentStep={"/payment"}
						currentUser={currentUser}
					/>
					<h1>Payment Method</h1>
					<Form onSubmit={submitHandler}>
						<Form.Group>
							<Form.Label className="mb-3" as="legend">
								Select Method
							</Form.Label>
							<Col>
								<Form.Check
									className="my-3"
									type="radio"
									label="Stripe atau Credit Card"
									id="stripe"
									name="paymentMethod"
									value="stripe"
									checked={metodePembayaran === "stripe"}
									onChange={(e) => setMetodePembayaran(e.target.value)}
								></Form.Check>

								<Form.Check
									className="my-3"
									type="radio"
									label="Paypal atau Credit Card"
									id="paypal"
									name="paymentMethod"
									value="paypal"
									checked={metodePembayaran === "paypal"}
									onChange={(e) => setMetodePembayaran(e.target.value)}
								></Form.Check>
							</Col>
						</Form.Group>

						<Button type="submit" variant="dark">
							Continue
						</Button>
					</Form>
				</FormContainer>
			</>
		)
	);
};

export default Pembayaran;
