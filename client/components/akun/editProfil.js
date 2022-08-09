import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import Message from "../common/Message";

const EditProfile = ({ user }) => {
	const [nama, setNama] = useState("");
	const [foto, setFoto] = useState("");
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
			nama,
			foto,
			jsonAlamatKirim: user.alamatKirim,
		},
		onSuccess: () => {
			setUpdateSuccess(true);
			Router.push("/dashboard");
		},
	});

	useEffect(() => {
		if (user || updateSuccess) {
			setNama(user.nama);
			setFoto(user.foto);
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

	const myLoader = ({ src, width, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/pacemaker/foto/upload/${src}`;
		} else {
			return `${src}&q=${quality || 40}`;
		}
	};

	return (
		<Form onSubmit={submitHandler}>
			<Row>
				{message && <Message variant="danger">{message}</Message>}
				{showErrors ? errors : null}
				{updateSuccess && <Message variant="success">Ubah Profil</Message>}

				<Col xs={12} md={6}>
					<div className="dashboard-profile-img">
						<Image
							loader={myLoader}
							src={user.foto}
							layout="fill"
							objectFit="cover"
							priority={true}
							alt={"foto profil"}
						/>
					</div>
				</Col>

				<Col xs={12} md={6}>
					<Form.Group controlId="nama">
						<Form.Label>Nama</Form.Label>
						<Form.Control
							type="text"
							placeholder="Masukkan nama"
							value={nama}
							onChange={(e) => setNama(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="image" className="my-3">
						<Form.Label>Upload foto profil anda</Form.Label>
						<Form.Control
							type="file"
							placeholder="Pilih file"
							value={foto}
							onChange={(e) => setFoto(e.target.value)}
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

export default EditProfile;
