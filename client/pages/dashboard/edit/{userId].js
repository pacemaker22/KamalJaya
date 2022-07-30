import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Head from "next/head";

import useRequest from "../../../hooks/use-request";
import Loader from "../../../components/common/Loader";

const UserEdit = ({ users, currentUser }) => {
	const { userId } = useRouter().query;
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState(undefined);
	const [nama, setNama] = useState("");
	const [alamat, setAlamat] = useState("");
	const [kota, setKota] = useState("");
	const [kodePos, setKodePos] = useState("");
	const [isReady, setIsReady] = useState(false);
	const [loading, setLoading] = useState(false);

	const user = users.find((user) => user.id === userId);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${userId}`,
		method: "patch",
		body: {
			email,
			password,
			isAdmin,
			nama,
			image,
			gender,
			age,
			bio,
			jsonAlamatKirim: JSON.stringify({
				alamat: alamat,
				kota: kota,
				kodePos: kodePos,
			}),
		},
		onSuccess: () => {
			Router.push("/admin");
			setLoading(false);
		},
	});

	useEffect(() => {
		// Protect unauthorized access
		if (!currentUser || currentUser.isAdmin === false) {
			return Router.push("/signin");
		} else {
			setIsReady(true);
		}

		if (user) {
			setEmail(user.email);
			setPassword(user.password);
			setIsAdmin(user.isAdmin);
			setNama(user.nama);
			setImage(user.image);
			setGender(user.gender);
			setAge(user.age);
			setBio(user.bio);

			if (user.alamatKirim) {
				setAlamat(user.alamatKirim.alamat);
				setKota(user.alamatKirim.kota);
				setKodePos(user.alamatKirim.kodePos);
				setCountry(user.alamatKirim.country);
			}
		}
	}, []);

	const submitHandler = async (event) => {
		event.preventDefault();
		setLoading(true);

		doRequest();
	};

	return (
		isReady && (
			<>
				<Head>
					<title>Edit User Information</title>
				</Head>
				{loading ? (
					<div
						className="d-flex justify-content-center align-items-center px-0"
						style={{ marginTop: "80px" }}
					>
						<Loader />
					</div>
				) : (
					<Container className="app-container">
						<h1>Edit User Information</h1>
						<Row className="mt-3">
							<Col md={6}>
								<Form onSubmit={submitHandler}>
									<Form.Group controlId="email" className="my-3">
										<Form.Label>Alamat Email</Form.Label>
										<Form.Control
											type="email"
											placeholder="masukkan alamat email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										></Form.Control>
									</Form.Group>

									<Form.Group controlId="password" className="my-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Masukkan password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										></Form.Control>
									</Form.Group>

									<Form.Group controlId="isadmin" className="my-3">
										<Form.Label>Admin</Form.Label>
										<Form.Control
											as="select"
											className="form-select"
											value={isAdmin}
											onChange={(e) => setIsAdmin(e.target.value)}
										>
											<option value="">Select Status</option>
											<option value="true">TRUE</option>
											<option value="false">FALSE</option>
										</Form.Control>
									</Form.Group>
									<Form.Group controlId="nama" className="my-3">
										<Form.Label>Nama</Form.Label>
										<Form.Control
											type="text"
											placeholder="Masukan nama anda"
											value={nama}
											onChange={(e) => setNama(e.target.value)}
										></Form.Control>
									</Form.Group>

									{errors}
									<Button className="mt-3" type="submit" variant="dark">
										{loading ? (
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
										Update
									</Button>
								</Form>
							</Col>

							<Col md={6}>
								<Form.Group controlId="alamat" className="my-3">
									<Form.Label>Alamat</Form.Label>
									<Form.Control
										type="text"
										placeholder="masukan alamat"
										value={alamat}
										onChange={(e) => setAlamat(e.target.value)}
									></Form.Control>
								</Form.Group>

								<Form.Group controlId="kota" className="my-3">
									<Form.Label>kota</Form.Label>
									<Form.Control
										type="text"
										placeholder="masukan kota anda tinggal"
										value={kota}
										onChange={(e) => setKota(e.target.value)}
									></Form.Control>
								</Form.Group>

								<Form.Group controlId="kodePos" className="my-3">
									<Form.Label>Kode Pos</Form.Label>
									<Form.Control
										type="text"
										placeholder="Masukan kode pos"
										value={kodePos}
										onChange={(e) => setKodePos(e.target.value)}
									></Form.Control>
								</Form.Group>
							</Col>
						</Row>
					</Container>
				)}
			</>
		)
	);
};

export default UserEdit;
