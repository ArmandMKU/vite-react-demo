import React from "react"
import { Link, useLocation } from "react-router-dom"
import Header from "../common/Header"

const BookingSuccess = () => {
	const location = useLocation()
	const message = location.state?.message
	const error = location.state?.error
	return (
		<div className="container">
			<Header title="Booking Success" />
			<div className="mt-5">
				{message ? (
					<div>
						<h3 className="text-success"> Réservation réussie !</h3>
						<p className="text-success">{message}</p>
					</div>
				) : (
					<div>
						<h3 className="text-danger"> Erreur lors de la réservation de la chambre !</h3>
						<p className="text-danger">{error}</p>
						
					</div>
				)}
			</div>
		</div>
	)
}

export default BookingSuccess
