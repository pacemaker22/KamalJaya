import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const warnaSelector = ({ produk, callback, margin, size, flex }) => {
	const [index, setIndex] = useState(null);
	const [text, setText] = useState("");
	const [warnaItemArray, setWarnaItemArray] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (produk?.warnaItem) {
			produk.warnaItem.toLowerCase();
			const warnaItem = produk?.warnaItem.split(",");

			setWarnaItemArray(warnaItem);
			setLoading(false);
		}

		if (warnaItemArray !== null && callback) {
			callback(warnaArray[index]);
		}
	}, [produk, index]);

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			{text.toLowerCase()}
		</Tooltip>
	);

	// Defined set of light color that want to has outer border
	const lightColor = ["White", "Beige", "Lemonchiffon", "Lightyellow"];

	return loading ? null : (
		<div className={`px-0 d-flex flex-row justify-content-${flex}`}>
			{warnaItemArray.map((warna, i) => (
				<OverlayTrigger
					key={i}
					placement="top"
					delay={{ show: 50, hide: 0 }}
					overlay={renderTooltip}
					onEnter={() => setText(warna)}
				>
					{i === index ? (
						<div
							className="warna-selector-outer px-0 color-selected"
							style={{
								margin: `${margin}`,
								width: `${size}`,
							}}
						>
							{lightColors.find((lightColor) => lightColor === warna) !==
							undefined ? (
								<span
									className="warna-selector-inner"
									style={{
										backgroundColor: `${warna}`,
										color: `${warna}`,
										border: "0px solid #000",
									}}
									onClick={() => setIndex(i)}
								></span>
							) : (
								<span
									className="warna-selector-inner"
									style={{
										backgroundColor: `${warna}`,
										color: `${warna}`,
									}}
									onClick={() => setIndex(i)}
								></span>
							)}
						</div>
					) : (
						<div
							className="warna-selector-outer px-0"
							style={{
								margin: `${margin}`,
								width: `${size}`,
							}}
						>
							{lightColors.find((lightColor) => lightColor === color) !==
							undefined ? (
								<span
									className="warna-selector-inner"
									style={{
										backgroundColor: `${warna}`,
										color: `${warna}`,
										border: "1px solid #000",
									}}
									onClick={() => setIndex(i)}
								></span>
							) : (
								<span
									className="warna-selector-inner"
									style={{
										backgroundColor: `${warna}`,
										color: `${warna}`,
									}}
									onClick={() => setIndex(i)}
								></span>
							)}
						</div>
					)}
				</OverlayTrigger>
			))}
		</div>
	);
};

export default warnaSelector;
