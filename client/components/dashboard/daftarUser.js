import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import {
	faEdit,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CustomTooltip from "../common/CustomTooltip";
import useRequest from "../../hooks/use-request";

const daftarUser = ({ users }) => {
	const [userId, setUserId] = useState(false);
	const [loading, setLoading] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${userId}`,
		method: "delete",
		body: {},
		onSuccess: () => {
			setLoading(false);
			Router.push("/admin");
		},
	});

	useEffect(() => {
		if (loading) {
			if (window.confirm("Apakah anda yakin?")) {
				doRequest();
			}
		}
	}, [loading]);

	const deleteHandler = async (id) => {
		setLoading(true);
		setUserId(id);
	};
	return (
		<Row className="align-items-center">
			<Col>
				{errors}
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>nama</th>
							<th>EMAIL</th>
							<th>ALAMAT</th>
							<th>KOTA</th>
							<th>KODEPOS</th>
							<th>DETAIL</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr key={user.id}>
								<td>
									<CustomTooltip index={index} mongoId={user.id} />
								</td>
								<td>{user?.nama}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>
									{user.alamatKirim?.alamat
										? user.alamatKirim?.alamat
										: null}
								</td>
								<td>
									{user.alamatKirim?.kota
										? user.alamatKirim?.kota
										: null}
								</td>
								<td>
									{user.alamatKirim?.kodePos
										? user.alamatKirim?.kodePos
										: null}
								</td>
								<td>
									<Link
										href={"/dashboard/edit/[userId]"}
										as={`/dashboard/edit/${user.id}`}
										passHref
									>
										<Button variant="dark" className="btn-sm mx-1">
											<FontAwesomeIcon icon={faEdit} />
										</Button>
									</Link>
									<Button
										variant="danger"
										className="btn-sm mx-1"
										onClick={() => deleteHandler(user.id)}
									>
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
										) : (
											<FontAwesomeIcon icon={faTrash} />
										)}
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Col>
		</Row>
	);
};

export default daftarUser;
