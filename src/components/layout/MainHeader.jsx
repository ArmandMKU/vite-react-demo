import React from "react"

import { Container } from "react-bootstrap"

const MainHeader = () => {
	return (
		<header className="header-banner">
			<div className="overlay"></div>
			<div className="animated-texts overlay-content">
				<h1>
					Bienvenue à <span className="hotel-color">Hotel Euzhan</span>
				</h1>
				<h4>Découvrez la meilleure hospitalité de la ville</h4>
			</div>
			{/* <Container className="text-center px-5 py-5 justify-content-center">
				<div className="animated-texts overlay-content">
					<h1>
					Découvrez la meilleure hospitalité chez <span className="hotel-color">Hotel Euzhan</span>
					</h1>
					<h3>Nous offrons les meilleurs services pour tous vos besoins.</h3>
				</div>
			</Container> */}
		</header>
	)
}

export default MainHeader
