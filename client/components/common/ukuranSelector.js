import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ukuranSelector = ({ produk, width, callback }) => {
	const [index, setIndex] = useState(null);
	const [text, setText] = useState("");
	const [ukuranArray, setUkuranArray] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (produk?.ukuranItem) {
			produk.ukuranItem.toUpperCase();
			const ukuranItem = produk?.ukuranItem.split(",");

			setUkuranArray(ukuranItem);
			setLoading(false);
		}

		if (ukuranArray !== null && callback) {
			callback(ukuranArray[index]);
		}
	}, [produk, index]);

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			{text.toUpperCase()}
		</Tooltip>
	);

	return loading ? null : (
		<div className="px-0 d-flex flex-row">
			{ukuranArray.map((ukuran, i) => (
				<OverlayTrigger
					key={i}
					placement="top"
					delay={{ show: 50, hide: 0 }}
					overlay={renderTooltip}
					onEnter={() => setText(ukuran)}
				>
					{i === index ? (
						<i
							className="ukuran-selector"
							style={{
								backgroundColor: "#000",
								color: "#fff",
								width: `${width}`,
								height: `${width}`,
							}}
							onClick={() => setIndex(i)}
						>
							{ukuran}
						</i>
					) : (
						<i
							className="ukuran-selector"
							style={{
								width: `${width}`,
								height: `${width}`,
							}}
							onClick={() => setIndex(i)}
						>
							{ukuran}
						</i>
					)}
				</OverlayTrigger>
			))}
		</div>
	);
};

export default ukuranSelector;
