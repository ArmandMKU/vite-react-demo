import React, { useContext } from "react"
import { useAuth } from "./AuthProvider"
import { Link, useNavigate } from "react-router-dom"

const Logout = ({setToken}) => {	
	const auth = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		auth.handleLogout()
		setToken(null)
		navigate("/", { state: { message: " Vous avez été déconnecté!" } })
	}

	return (
		<>
			<li>
				<Link className="dropdown-item" to={"/profile"}>
					Profil
				</Link>
			</li>
			<li>
				<hr className="dropdown-divider" />
			</li>
			<button className="dropdown-item" onClick={handleLogout}>
				Se déconnecter
			</button>
		</>
	)
}

export default Logout
