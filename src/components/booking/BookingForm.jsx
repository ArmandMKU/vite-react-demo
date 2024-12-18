import React, { useEffect } from "react";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // ES 2015
import { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// import moment from "moment"
import dayjs from "dayjs";
dayjs.extend(isSameOrAfter);

const BookingForm = () => {
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);

  const currentUser = localStorage.getItem("userId");

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: "",
    numOfChildren: "",
  });

  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calculatePayment = () => {
    // const checkInDate = moment(booking.checkInDate)
    // const checkOutDate = moment(booking.checkOutDate)
    // const diffInDays = checkOutDate.diff(checkInDate, "days")
    const checkInDate = dayjs(booking.checkInDate);
    const checkOutDate = dayjs(booking.checkOutDate);
    const diffInDays = checkOutDate.diff(checkInDate, "day");
    const paymentPerDay = roomPrice ? roomPrice : 0;
    return diffInDays * paymentPerDay;
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numOfAdults);
    const childrenCount = parseInt(booking.numOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };

  const isCheckOutDateValid = () => {
    if (
      !dayjs(booking.checkOutDate).isSameOrAfter(dayjs(booking.checkInDate))
      //   !moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))
    ) {
      setErrorMessage(
        "La date de départ doit être postérieure à la date d'arrivée"
      );
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.checkValidity() === false ||
      !isGuestCountValid() ||
      !isCheckOutDateValid()
    ) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
    }
    setValidated(true);
  };

  const handleFormSubmit = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setIsSubmitted(true);
      navigate("/booking-success", { state: { message: confirmationCode } });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
      navigate("/booking-success", { state: { error: errorMessage } });
    }
  };

  return (
    <>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card card-body mt-5">
              <h4 className="card-title">Réserver la chambre</h4>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="guestFullName" className="hotel-color">
                    Nom et Prénom(s)
                  </Form.Label>
                  <FormControl
                    required
                    type="text"
                    id="guestFullName"
                    name="guestFullName"
                    value={booking.guestFullName}
                    placeholder="Saisir votre nom et prenom"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez saisir votre nom et prenom(s), s'il vous plait.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="guestEmail" className="hotel-color">
                    Email
                  </Form.Label>
                  <FormControl
                    required
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={booking.guestEmail}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez saisir une adresse email valide, s'il vous plaît.
                  </Form.Control.Feedback>
                </Form.Group>

                <fieldset style={{ border: "2px" }}>
                  <legend>Période d'hébergement</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="checkInDate" className="hotel-color">
                        Arrivée
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={booking.checkInDate}
                        placeholder="check-in-date"
                        min={dayjs().format("MMM D, YYYY")}
                        // min={moment().format("MMM Do, YYYY")}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez sélectionner une date d'arrivée.
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label
                        htmlFor="checkOutDate"
                        className="hotel-color"
                      >
                        Départ
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        placeholder="check-out-date"
                        min={dayjs().format("MMM D, YYYY")}
                        // min={moment().format("MMM Do, YYYY")}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez sélectionner une date de départ
                      </Form.Control.Feedback>
                    </div>
                    {errorMessage && (
                      <p className="error-message text-danger">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </fieldset>

                <fieldset style={{ border: "2px" }}>
                  <legend>Nombre d'hôtes</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="numOfAdults" className="hotel-color">
                        Adultes
                      </Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numOfAdults"
                        name="numOfAdults"
                        value={booking.numOfAdults}
                        min={1}
                        placeholder="0"
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez sélectionner au moins 1 adulte, s'il vous
                        plait.
                      </Form.Control.Feedback>
                    </div>
                    <div className="col-6">
                      <Form.Label
                        htmlFor="numOfChildren"
                        className="hotel-color"
                      >
                        Enfants
                      </Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numOfChildren"
                        name="numOfChildren"
                        value={booking.numOfChildren}
                        placeholder="0"
                        min={0}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Sélectionner 0 s'il n'y a pas d'enfants
                      </Form.Control.Feedback>
                    </div>
                  </div>
                </fieldset>

                <div className="form-group mt-2 mb-2">
                  <button type="submit" className="btn btn-hotel">
                    Continuer
                  </button>
                </div>
              </Form>
            </div>
          </div>

          <div className="col-md-5">
            {isSubmitted && (
              <BookingSummary
                booking={booking}
                payment={calculatePayment()}
                onConfirm={handleFormSubmit}
                isFormValid={validated}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingForm;
