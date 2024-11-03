import React, { useState } from "react"
import { addRoom } from "../utils/ApiFunctions"
import RoomTypeSelector from "../common/RoomTypeSelector"
import { Link } from "react-router-dom"
import UploadImages from "./UploadImages"

const AddRoom = () => {
	const [newRoom, setNewRoom] = useState({
		photos:[],
		roomType: "",
		roomPrice: "",
		roomDescription: ""
	})

	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [imagePreview, setImagePreview] = useState("")
	const [selectedImages, setSelectedImages] = useState([])

	const handleRoomInputChange = (e) => {
		const name = e.target.name
		let value = e.target.value
		if (name === "roomPrice") {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ""
			}
		}
		setNewRoom({ ...newRoom, [name]: value })
	}

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setNewRoom({ ...newRoom, photo: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		// setNewRoom({ ...newRoom, photos: selectedImages })
		// console.log("newRoom= ", newRoom)
		try {
			console.log("photos = ", newRoom.photos);
			const success = await addRoom(newRoom.photos, newRoom.roomType, newRoom.roomPrice, newRoom.roomDescription)
			if (success !== undefined) {
				setSuccessMessage("Une nouvelle chambre a été ajoutée avec succès !")
				setNewRoom({ photos: [], roomType: "", roomPrice: "" , roomDescription: ""})
				setImagePreview("")
				setErrorMessage("")
			} else {
				setErrorMessage("Erreur lors de l'ajout d'une nouvelle chambre")
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}

	return (
		<>
			<section className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8 col-lg-6">
						<h2 className="mt-5 mb-2">Ajouter une nouvelle chambre</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="roomType" className="form-label">
									Type de chambre
								</label>
								<div>
									<RoomTypeSelector
										handleRoomInputChange={handleRoomInputChange}
										newRoom={newRoom}
									/>
								</div>
							</div>
							<div className="mb-3">
								<label htmlFor="roomPrice" className="form-label">
									Prix ​​de la chambre
								</label>
								<input
									required
									type="number"
									className="form-control"
									id="roomPrice"
									name="roomPrice"
									value={newRoom.roomPrice}
									onChange={handleRoomInputChange}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="roomDescription" className="form-label">
									Description
								</label>
								<input
									required
									type="text"
									className="form-control"
									id="roomDescription"
									name="roomDescription"
									value={newRoom.roomDescription}
									onChange={handleRoomInputChange}
								/>
							</div>

							<div className="mb-3">
								<UploadImages newRoom={newRoom} setNewRoom={setNewRoom} />
								{/* <label htmlFor="photo" className="form-label">
									Photo de la chambre
								</label>
								<input
									required
									name="photo"
									id="photo"
									type="file"
									className="form-control"
									value={newRoom.photo}
									onChange={handleImageChange}
								/>
								{imagePreview && (
									<img
										src={imagePreview}
										alt="Preview  room photo"
										style={{ maxWidth: "400px", maxHeight: "400px" }}
										className="mb-3"></img>
								)} */}								
							</div>
							<div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/existing-rooms"} className="btn btn-outline-info">
									Chambres existantes
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Sauvegarder la chambre
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	)
}

export default AddRoom
