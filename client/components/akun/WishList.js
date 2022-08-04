import Link from "next/link";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";

import ColorSelector from "../common/ColorSelector";
import CustomTooltip from "../common/CustomTooltip";

const WishList = ({ produkToko }) => {
	return (
		<Row className="align-items-center">
			<Col>
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAMA</th>
							<th>HARGA</th>
							<th>WARNA</th>
							<th>KATEGORI</th>
						</tr>
					</thead>
					<tbody>
						{produkToko.map((product, index) => (
							<tr key={product.id}>
								<td>
									<CustomTooltip index={index} mongoId={product.id} />
								</td>
								<td>
									<Link
										href={`/produk/[produkId]`}
										as={`/produk/${produk.id}`}
									>
										<a>{produk.nama}</a>
									</Link>
								</td>
								<td>${produk.harga}</td>
								<td>
									<ColorSelector
										produk={produk}
										margin={"2px"}
										size={"1.5rem"}
										flex={"start"}
									/>
								</td>
								<td>{produk.kategori}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Col>
		</Row>
	);
};

export default WishList;
