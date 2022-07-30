import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const kuantitasSelector = ({ produk, kuantitas, setKuantitas }) => {
	useEffect(() => {
		if (kuantitas > produk.jumlahStock) {
			setKuantitas(produk.jumlahStock);
		} else if (kuantitas < 1) {
			setKuantitas(1);
		}
	}, [kuantitas]);

	return (
		<div className="kuantitas-selector d-flex flex-row align-items-center">
			<div
				className="qty-btn decrease-btn"
				onClick={() => setKuantitas(kuantitas - 1)}
			>
				-
			</div>
			<Form.Group controlId="jumlahStock" className="kuantitas-box">
				<Form.Control
					type="number"
					value={kuantitas}
					onChange={(e) => setKuantitas(Number(e.target.value))}
				></Form.Control>
			</Form.Group>
			<div
				className="qty-btn decrease-btn"
				onClick={() => setKuantitas(kuantitas + 1)}
			>
				+
			</div>
		</div>
	);
};

export default kuantitasSelector;
