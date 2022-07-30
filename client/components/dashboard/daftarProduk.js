import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import warnaSelector from "../common/warnaSelector";
import CustomTooltip from "../common/CustomTooltip";
import ukuranSelector from "../common/ukuranSelector";

const daftarProduk = ({ produkToko, orderProduk, pembayaranProduk }) => {
	const [deleteProductId, setDeleteProductId] = useState(null);
	const [loading, setLoading] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/produk/${deleteProductId}`,
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

	const deleteHandler = (id) => {
		setDeleteProductId(id);
		setLoading(true);
	};

	return (
		<Row className="align-items-center">
			<Col>
				{errors}
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAMA</th>
							<th>KUANTITAS</th>
							<th>HARGA</th>
							<th>WARNA</th>
							<th>UKURAN</th>
							<th>PRODUK VERSI.</th>
							<th>ORDER VERSI.</th>
							<th>PEMBAYARAN VERSI.</th>
							<th>DETAIL</th>
						</tr>
					</thead>
					<tbody>
						{produkToko.map((produk, index) => (
							<tr key={produk.id}>
								<td>
									<CustomTooltip index={index} mongoId={produk.id} />
								</td>
								<td>
									<Link
										href={`/produk/[produkId]`}
										as={`/produck/${produk.id}`}
									>
										<a>{product.nama}</a>
									</Link>
								</td>
								<td>{produk.jumlahStock}</td>
								<td>${produk.harga}</td>
								<td>
									<warnaSelector
										produk={produk}
										margin={"2px"}
										size={"1.5rem"}
										flex={"start"}
									/>
								</td>
								<td>
									<ukuranSelector produk={produk} width={"1.2rem"} />
								</td>
								<td>{produk.kategori}</td>
								<td>{produk.version}</td>
								<td>
									{orderProduk.find(
										(orderProduk) => orderProduk.id === produk.id
									).version === product.version ? (
										<span style={{ color: "green" }}>OK</span>
									) : (
										<span style={{ color: "red" }}>
											{
												orderProduk.find(
													(orderProduk) => orderProduk.id === produk.id
												).version
											}
										</span>
									)}
								</td>
								<td>
									{pembayaranProduk.find(
										(pembayaranProduk) => pembayaranProduk.id === produk.id
									).version === produk.version ? (
										<span style={{ color: "green" }}>OK</span>
									) : (
										<span style={{ color: "red" }}>
											{
												pembayaranProduk.find(
													(pembayaranProduk) => pembayaranProduk.id === produk.id
												).version
											}
										</span>
									)}
								</td>
								<td>
									<Link
										href={`/produk/edit/[produkId]`}
										as={`/produk/edit/${produk.id}`}
										passHref
									>
										<Button variant="dark" className="btn-sm mx-1">
											<FontAwesomeIcon icon={faEdit} />
										</Button>
									</Link>
									<Button
										variant="danger"
										className="btn-sm mx-1"
										onClick={() => deleteHandler(produk.id)}
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

export default daftarProduk;
