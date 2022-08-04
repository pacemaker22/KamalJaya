import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import Message from "../common/Message";

const editPassword = ({ user }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [message, setMessage] = useState(null);
	const [showErrors, setShowErrors] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [updateSuccess, setUpdateSukses] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${user.id}`,
		method: "patch",
		body: {
			email,
			isAdmin: user.isAdmin,
			nama: user.nama,
			foto: user.foto,
			jsonAlamatKirim: user.jsonAlamatKirim,
		},
		onSuccess: () => {
			setUpdateSukses(true);
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
			setUpdateSukses(false);
			setLoadingUpdate(false);
		}, 1000);
	}, [user, updateSuccess, errors]);

	const submitHandler = (e) => {
		e.preventDefault();
		setMessage(null);
		setShowErrors(false);
		setLoadingUpdate(true);

		if (newPassword !== confirmNewPassword) {
			setMessage("Password tidak sama");
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
				{updateSuccess && <Message variant="success">update profile</Message>}

				<Col>
					<Form.Group controlId="email" className="mb-3">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Masukkan Alamat email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="password" className="my-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="masukan password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="newPassword" className="my-3">
						<Form.Label>New Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="masukan password baru anda"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="confirmNewPassword" className="my-3">
						<Form.Label>Confirm New Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="konfirmasi password baru anda"
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

export default editPassword;
