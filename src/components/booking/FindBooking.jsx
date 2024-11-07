import React, { useState } from "react";
// import moment from "moment"
import dayjs from "dayjs";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../utils/ApiFunctions";

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuests: "",
  });

  const emptyBookingInfo = {
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuests: "",
  };
  const [isDeleted, setIsDeleted] = useState(false);

  const handleInputChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      setBookingInfo(data);
      setError(null);
    } catch (error) {
      setBookingInfo(emptyBookingInfo);
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }

    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingInfo.id);
      setIsDeleted(true);
      setSuccessMessage("La réservation a été annulée avec succès !");
      setBookingInfo(emptyBookingInfo);
      setConfirmationCode("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setIsDeleted(false);
    }, 2000);
  };

  return (
    <>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center mb-4">Consulter ma réservation</h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Saisir la référence de réservation"
            />

            <button type="submit" className="btn btn-hotel input-group-text">
              Consulter ma réservation
            </button>
          </div>
        </form>

        {isLoading ? (
          <div>Recherche de votre réservation en cours...</div>
        ) : error ? (
          <div className="text-danger">Erreur: {error}</div>
        ) : bookingInfo.bookingConfirmationCode ? (
          <div className="col-md-6 mt-4 mb-5">
            <h3>Détails de la réservation</h3>
            <p className="text-success">
              Référence de réservation: {bookingInfo.bookingConfirmationCode}
            </p>
            <p>N° chambre: {bookingInfo.room.id}</p>
            <p>Type de chambre: {bookingInfo.room.roomType}</p>
            <p>
              Arrivée:{" "}
              {dayjs(bookingInfo.checkInDate)
                .subtract(1, "month")
                .format("MMM Do, YYYY")}
            </p>
            <p>
              Départ:{" "}
              {dayjs(bookingInfo.checkInDate)
                .subtract(1, "month")
                .format("MMM Do, YYYY")}
            </p>
            <p>Nom et prénom(s): {bookingInfo.guestName}</p>
            <p>Adresse e-mail: {bookingInfo.guestEmail}</p>
            <p>Adultes: {bookingInfo.numOfAdults}</p>
            <p>Enfants: {bookingInfo.numOfChildren}</p>
            <p>Nbre Total de personnes: {bookingInfo.totalNumOfGuests}</p>

            {!isDeleted && (
              <button
                onClick={() => handleBookingCancellation(bookingInfo.id)}
                className="btn btn-danger"
              >
                Annuler la réservation
              </button>
            )}
          </div>
        ) : (
          <div>Recherche de la réservation en cours...</div>
        )}

        {isDeleted && (
          <div className="alert alert-success mt-3 fade show">
            {successMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default FindBooking;
