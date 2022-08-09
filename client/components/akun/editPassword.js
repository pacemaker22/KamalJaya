import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import Message from "../common/Message";

const EditSecurity = ({ user }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");

	const [message, setMessage] = useState(null);
	const [showErrors, setShowErrors] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${user.id}`,
		method: "patch",
		body: {
			email,
			isAdmin: user.isAdmin,
			nama: user.nama,
			foto: user.foto,
			jsonAlamatKirim: user.alamatKirim,
		},
		onSuccess: () => {
			setUpdateSuccess(true);
			Router.push("/dashboard");
		},
	});

	useEffect(() => {
		if (user || updateSuccess) {
			setEmail(user.email);
			setPassword("");
			setNewPassword("");
			setConfirmNewPassword("");
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

		if (newPassword !== confirmNewPassword) {
			setMessage("Password do not match");
			setLoadingUpdate(false);
		} else if (newPassword !== "") {
			doRequest({ password: password, newPassword: newPassword });
		} else {
			doRequest({ password: password });
		}
	};

	return (
		<Form onSubmit={submitHandler}>
			<Row>
				{message && <Message variant="danger">{message}</Message>}
				{showErrors ? errors : null}
				{updateSuccess && <Message variant="success">Profile Updated</Message>}

				<Col>
					<Form.Group controlId="email" className="mb-3">
						<Form.Label>Alamat Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="Masukan Alamat Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="password" className="my-3">
						<Form.Label>Password Lama</Form.Label>
						<Form.Control
							type="password"
							placeholder="Masukkan Password Lama"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="passwordBaru" className="my-3">
						<Form.Label>Password Baru</Form.Label>
						<Form.Control
							type="password"
							placeholder="Masukkan Password anda yang baru"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="konfirmasiPasswordBaru" className="my-3">
						<Form.Label>Konfirmasi password baru</Form.Label>
						<Form.Control
							type="password"
							placeholder="Ulangi password baru anda"
							value={confirmNewPassword}
							onChange={(e) => setConfirmNewPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					{password === "" ? (
						<div className="px-0 py-2" style={{ color: "red" }}>
							{"Please enter password"}
						</div>
					) : null}
					{newPassword !== "" && confirmNewPassword === "" ? (
						<div className="px-0 py-2" style={{ color: "red" }}>
							{"Please confirm new password"}
						</div>
					) : null}
					<Button
						type="submit"
						variant="dark"
						disabled={password !== "" ? false : true}
					>
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

export default EditSecurity;
