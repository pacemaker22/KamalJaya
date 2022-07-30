import { faPaypal, faStripeS } from "@fortawesome/free-brands-svg-icons";
import {
	faCheck,
	faInfoCircle,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "../common/CustomTooltip";
import ExpireTimer from "../common/ExpireTimer";

const daftarOrderUser = ({ myOrders }) => {
	return (
		<Row className="align-items-center">
			<Col>
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ORDER ID</th>
							<th>TANGGAL</th>
							<th>WAKTU</th>
							<th>TOTAL</th>
							<th>METODE PEMBAYARAN</th>
							<th>KADALUWARSA</th>
							<th>BAYAR</th>
							<th>TERKIRIM</th>
							<th>DETAIL</th>
						</tr>
					</thead>
					<tbody>
						{myOrders.map((order, index) => (
							<tr key={order.id}>
								<td>
									<CustomTooltip index={index} mongoId={order.id} />{" "}
								</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>
									{new Date(`${order.createdAt}`).toString().substring(16, 21)}
								</td>
								<td>$ {order.totalHarga}</td>
								<td>
									<p style={{ fontSize: "1rem" }}>
										{order.metodePembayaran === "paypal" ? (
											<>
												<FontAwesomeIcon icon={faPaypal} /> PayPal
											</>
										) : (
											<>
												<FontAwesomeIcon icon={faStripeS} /> Stripe
											</>
										)}
									</p>
								</td>
								<td>
									{order.status === "dibatalkan" ? (
										<p style={{ color: "red", fontWeight: "bolder" }}>
											Kadaluwarsa
										</p>
									) : order.status === "selesai" ? (
										<p style={{ color: "green", fontWeight: "bolder" }}>
											Selesai
										</p>
									) : (
										<>
											<ExpireTimer order={order} />
										</>
									)}
								</td>
								<td>
									{order.isBayar ? (
										<p>
											<FontAwesomeIcon
												icon={faCheck}
												style={{ color: "green" }}
											/>{" "}
											{order.tanggalBayar?.substring(0, 10)}
										</p>
									) : (
										<p>
											<FontAwesomeIcon
												icon={faTimes}
												style={{ color: "red" }}
											/>{" "}
											Tidak Dibayar
										</p>
									)}
								</td>
								<td>
									{order.isTerkirim ? (
										<p>
											<FontAwesomeIcon
												icon={faCheck}
												style={{ color: "green" }}
											/>{" "}
											{order.tanggalKirim.substring(0, 10)}
										</p>
									) : (
										<p>
											<FontAwesomeIcon
												icon={faTimes}
												style={{ color: "red" }}
											/>{" "}
											Tidak Dikirim
										</p>
									)}
								</td>
								<td>
									<Link
										href={"/orders/[orderId]"}
										as={`/orders/${order.id}`}
										passHref
									>
										<Button className="btn-sm" variant="light">
											<FontAwesomeIcon icon={faInfoCircle} /> Detail
										</Button>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Col>
		</Row>
	);
};

export default daftarOrderUser;
