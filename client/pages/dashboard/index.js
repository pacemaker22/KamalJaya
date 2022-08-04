import React, { useEffect, useState } from "react";
import { Row, Col, Container, Nav } from "react-bootstrap";
import dynamic from "next/dynamic";
import Router from "next/router";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
	faBasketShopping,
	faCircleInfo,
	faHeart,
	faMapLocationDot,
	faShieldHalved,
	faStar,
} from "@fortawesome/free-solid-svg-icons";
import daftarOrderUser from "../../components/akun/daftarOrderUser";
import editAlamat from "../../components/akun/editAlamat";
import editPassword from "../../components/akun/editPassword";
import editProfile from "../../components/akun/editProfile";


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

const Dashboard = ({ currentUser, users, myOrders, produkToko }) => {
	const [isReady, setIsReady] = useState(false);
	const user = users.find((user) => user.id === currentUser?.id);

	useEffect(() => {
		// Protect unauthorized access
		if (!currentUser) {
			return Router.push("/signin");
		} else {
			setIsReady(true);
		}
	}, []);

	return (
		isReady && (
			<>
				<Head>
					<title>Pengaturan Akun</title>
				</Head>

				<Container className="app-container admin-dashboard">
					<h1>Pengaturan Akun</h1>

					<DynamicTabContainer
						variant="light"
						defaultActiveKey="profile"
						forceRenderTabPanel={true}
					>
						<Row>
							<Col md={2} className="mb-5">
								<Nav variant="pills" className="flex-column">
									<Nav.Item>
										<Nav.Link eventKey="profile">
											<FontAwesomeIcon icon={faUser} /> Profile
										</Nav.Link>
									</Nav.Item>

									<Nav.Item>
										<Nav.Link eventKey="security">
											<FontAwesomeIcon icon={faShieldHalved} /> Password
										</Nav.Link>
									</Nav.Item>

									<Nav.Item>
										<Nav.Link eventKey="address">
											<FontAwesomeIcon icon={faMapLocationDot} /> Alamat
										</Nav.Link>
									</Nav.Item>

									<Nav.Item>
										<Nav.Link eventKey="orders">
											<FontAwesomeIcon icon={faBasketShopping} /> Order
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="support">
											<FontAwesomeIcon icon={faCircleInfo} /> Support
										</Nav.Link>
									</Nav.Item>
								</Nav>
							</Col>

							<Col md={10}>
								<DynamicTabContent>
									<DynamicTabPane eventKey="profile">
										<editProfile user={user} />
									</DynamicTabPane>

									<DynamicTabPane eventKey="password">
										<editPassword user={user} />
									</DynamicTabPane>

									<DynamicTabPane eventKey="alamat">
										<editAlamat user={user} />
									</DynamicTabPane>

									<DynamicTabPane eventKey="orders">
										<daftarOrderUser myOrders={myOrders} />
									</DynamicTabPane>

									<DynamicTabPane eventKey="wishlist">
										<WishList produkToko={produkToko} />
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

export default Dashboard;
