import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import Message from "../common/Message";

const editAlamat = ({ user }) => {
	const [alamat, setAlamat] = useState("");
	const [kota, setKota] = useState("");
	const [kodePos, setKodePos] = useState("");

	const [message, setMessage] = useState(null);
	const [showErrors, setShowErrors] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${user.id}`,
		method: "patch",
		body: {
			email: user.email,
			isAdmin: user.isAdmin,
			nama: user.name,
			foto: user.foto,
			jsonAlamatKirim: JSON.stringify({
				alamat: alamat,
				kota: kota,
				kodePos: kodePos,
			}),
		},
		onSuccess: (user) => {
			setUpdateSuccess(true);
			Router.push("/dashboard");
		},
	});

	useEffect(() => {
		if (user.alamatKirim || updateSuccess) {
			setAlamat(user.alamatKirim?.alamat);
			setKota(user.alamatKirim?.kota);
			setKodePos(user.alamatKirim?.kodePos);
			}

		if (errors) {
			setLoadingUpdate(false);
			setShowErrors(true);
		}

		setTimeout(() => {
			setUpdateSuccess(false);
			setLoadingUpdate(false);
		}, 1000);
	}, [user, updateSuccess, errors]);

	const submitHandler = (e) => {
		e.preventDefault();
		setMessage(null);
		setShowErrors(false);
		setLoadingUpdate(true);

		doRequest();
	};

	return (
		<Form onSubmit={submitHandler}>
			<Row>
				{message && <Message variant="danger">{message}</Message>}
				{showErrors ? errors : null}
				{updateSuccess && <Message variant="success">ubah alamat pengiriman</Message>}

				<Col>
					<Form.Group controlId="alamat" className="mb-3">
						<Form.Label>Alamat</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukan Alamat"
							value={alamat}
							onChange={(e) => setAlamat(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="kota" className="my-3">
						<Form.Label>Kota</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukkan kota"
							value={kota}
							onChange={(e) => setKota(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="kodepos" className="my-3">
						<Form.Label>Kode Pos</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukan Kode Pos"
							value={kodePos}
							onChange={(e) => setKodePos(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Button type="submit" variant="dark">
						{loadingUpdate ? (
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
				</Col>
			</Row>
		</Form>
	);
};

export default editAlamat;
