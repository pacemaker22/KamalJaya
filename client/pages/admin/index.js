import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Col, Container, Nav, Row } from "react-bootstrap";
import Router from "next/router";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBasketShopping,
	faPlus,
	faShirt,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import buatProduk from "../../components/dashboard/buatProduk";
import daftarUser from "../../components/dashboard/daftarUser";
import daftarOrder from "../../components/dashboard/daftarOrder"
import daftarProduk from "../../components/dashboard/daftarProduk";

const DynamicTabContainer = dynamic(
	() => import("react-bootstrap/TabContainer"),
	{
		ssr: false,
	}
);
const DynamicTabContent = dynamic(() => import("react-bootstrap/TabContent"), {
	ssr: false,
});
const DynamicTabPane = dynamic(() => import("react-bootstrap/TabPane"), {
	ssr: false,
});

const AdminDashboard = ({
	produkToko,
	users,
	orders,
	orderProduk,
	pembayaranProduk,
	currentUser,
}) => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Protect unauthorized access
		if (!currentUser || currentUser.isAdmin === false) {
			return Router.push("/signin");
		} else {
			setIsReady(true);
		}
	}, []);

	return (
		isReady && (
			<>
				<Head>
					<title>Admin Dashboard</title>
				</Head>
				<Container className="app-container admin-dashboard">
					<h1>Admin Dashboard</h1>
					<DynamicTabContainer
						variant="light"
						defaultActiveKey="product-list"
						forceRenderTabPanel={true}
					>
						<Row>
							<Col md={2} className="mb-5">
								<Nav variant="pills" className="flex-column">
									<Nav.Item>
										<Nav.Link eventKey="product-list">
											<FontAwesomeIcon icon={faShirt} /> Daftar Produk
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="user-list">
											<FontAwesomeIcon icon={faUser} /> Daftar User
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="order-list">
											<FontAwesomeIcon icon={faBasketShopping} /> Daftar Order
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="create-product">
											<FontAwesomeIcon icon={faPlus} /> Produk baru
										</Nav.Link>
									</Nav.Item>
								</Nav>
							</Col>

							<Col md={10}>
								<DynamicTabContent>
									<DynamicTabPane eventKey="product-list">
										<daftarProduk
											produkToko={produkToko}
											orderProduk={orderProduk}
											pembayaranProduk={pembayaranProduk}
										/>
									</DynamicTabPane>

									<DynamicTabPane eventKey="user-list">
										<buatProduk users={users} />
									</DynamicTabPane>

									<DynamicTabPane eventKey="order-list">
										<daftarOrder orders={orders} users={users} />
									</DynamicTabPane>

									<DynamicTabPane eventKey="create-product">
										<buatProduk />
									</DynamicTabPane>
								</DynamicTabContent>
							</Col>
						</Row>
					</DynamicTabContainer>
				</Container>
			</>
		)
	);
};

export default AdminDashboard;
