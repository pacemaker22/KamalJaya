import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import Message from "../common/Message";

const editProfile = ({ user }) => {
	const [nama, setNama] = useState("");
	const [message, setMessage] = useState(null);
	const [showErrors, setShowErrors] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [updateSukses, setUpdateSukses] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${user.id}`,
		method: "patch",
		body: {
			email: user.email,
			isAdmin: user.isAdmin,
			nama,
			jsonShippingAddress: user.shippingAddress,
		},
		onSuccess: () => {
			setUpdateSukses(true);
			Router.push("/dashboard");
		},
	});

	useEffect(() => {
		if (user || updateSukses) {
			setNama(user.nama);
		}

		if (errors) {
			setLoadingUpdate(false);
			setShowErrors(true);
		}

		setTimeout(() => {
			setUpdateSukses(false);
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

	const myLoader = ({ src, width, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/thasup/image/upload/${src}`;
		} else {
			return `${src}&q=${quality || 40}`;
		}
	};

	return (
		<Form onSubmit={submitHandler}>
			<Row>
				{message && <Message variant="danger">{message}</Message>}
				{showErrors ? errors : null}
				{updateSukses && <Message variant="success">Ubah Namamu Disini</Message>}

				<Col xs={12} md={6}>
					<div classnama="dashboard-profile-img">
						<Image
							loader={myLoader}
							src={user.image}
							layout="fill"
							objectFit="cover"
							priority={true}
							alt={"profile image"}
						/>
					</div>
				</Col>

				<Col xs={12} md={6}>
					<Form.Group controlId="nama">
						<Form.Label>Nama</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter nama"
							value={nama}
							onChange={(e) => setNama(e.target.value)}
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
								<span classnama="visually-hidden">Loading...</span>
							</Spinner>
						) : null}{" "}
						Update
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default editProfile;
