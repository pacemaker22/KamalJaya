import React, { useEffect, useState } from "react";

const ExpireTimer = ({ order }) => {
	const [waktuTersisa, setWaktuTersisa] = useState(0);

	useEffect(() => {
		const getWaktuTersisa = () => {
			const msLeft = new Date(order?.expiresAt) - new Date();
			setWaktuTersisa(Math.round(msLeft / (60 * 1000)));
		};

		getWaktuTersisa();
		const timerId = setInterval(getWaktuTersisa, 60000);

		return () => {
			clearInterval(timerId);
		};
	}, [order]);

	if (waktuTersisa < 0) {
		setWaktuTersisa(null);
	}

	return waktuTersisa === null ? (
		<p style={{ color: "red", fontWeight: "bolder" }}>Expired</p>
	) : (
		<>
			<strong>{waktuTersisa}</strong> minutes
		</>
	);
};

export default ExpireTimer;
