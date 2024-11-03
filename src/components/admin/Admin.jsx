import React from "react"
import { Link } from "react-router-dom"

const Admin = () => {
	return (
		<section className="container mt-5">
			<h2>Bienvenue dans le panneau d'administration</h2>
			<hr />
			<Link to={"/existing-rooms"}>Gérer les chambres</Link> <br />
			<Link to={"/existing-bookings"}>Gérer les réservations</Link>
		</section>
	)
}

export default Admin
