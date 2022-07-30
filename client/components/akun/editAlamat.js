import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import Message from "../common/Message";

const editAlamat = ({ user }) => {
	const [alamat, setAlamat] = useState("");
	const [kota, setKota] = useState("");
	const [kodePos, setkodePos] = useState("");
	const [message, setMessage] = useState(null);
	const [showErrors, setShowErrors] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [updateSukses, setupdateSukses] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${user.id}`,
		method: "patch",
		body: {
			email: user.email,
			isAdmin: user.isAdmin,
			nama: user.nama,
			jsonShippingalamat: JSON.stringify({
				alamat: alamat,
				kota: kota,
				kodePos: kodePos,
			}),
		},
		onSuccess: (user) => {
			setupdateSukses(true);
			Router.push("/dashboard");
		},
	});

	useEffect(() => {
		if (user.shippingalamat || updateSukses) {
			setAlamat(user.shippingalamat?.alamat);
			setKota(user.shippingalamat?.kota);
			setkodePos(user.shippingalamat?.kodePos);
			setCountry(user.shippingalamat?.country);
		}

		if (errors) {
			setLoadingUpdate(false);
			setShowErrors(true);
		}

		setTimeout(() => {
			setupdateSukses(false);
			setLoadingUpdate(false);
		}, 1000);
	}, [user, updateSukses, errors]);

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
				{updateSukses && <Message variant="success">alamat Updated</Message>}

				<Col>
					<Form.Group controlId="alamat" className="mb-3">
						<Form.Label>Alamat</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukan alamat"
							value={alamat}
							onChange={(e) => setAlamat(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="kota" className="my-3">
						<Form.Label>Kota</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukan kota"
							value={kota}
							onChange={(e) => setKota(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="kodePos" className="my-3">
						<Form.Label>Kode Pos</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukan Kode Pos"
							value={kodePos}
							onChange={(e) => setkodePos(e.target.value)}
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
