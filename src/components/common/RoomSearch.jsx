import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
// import moment from "moment";
import dayjs from "dayjs";
import { getAvailableRooms } from "../utils/ApiFunctions";
import RoomSearchResults from "./RoomSearchResult";
import RoomTypeSelector from "./RoomTypeSelector";

const RoomSearch = () => {
  const [searchQuery, setSearchQuery] = useState({
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // const checkInMoment = moment(searchQuery.checkInDate)
    // const checkOutMoment = moment(searchQuery.checkOutDate)
    const checkInMoment = dayjs(searchQuery.checkInDate);
    const checkOutMoment = dayjs(searchQuery.checkOutDate);
    if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
      setErrorMessage("Veuillez saisir des dates valides, s'il vous plaît.");
      return;
    }
    if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
      setErrorMessage(
        "La date de départ doit être postérieure à la date d'arrivée."
      );
      return;
    }
    setIsLoading(true);
    getAvailableRooms(
      searchQuery.checkInDate,
      searchQuery.checkOutDate,
      searchQuery.roomType
    )
      .then((response) => {
        console.log("Available rooms= ", response);
        setAvailableRooms(response.data);
        setTimeout(() => setIsLoading(false), 2000);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    // const checkInDate = moment(searchQuery.checkInDate);
    // const checkOutDate = moment(searchQuery.checkOutDate);
    const checkInDate = dayjs(searchQuery.checkInDate);
    const checkOutDate = dayjs(searchQuery.checkOutDate);
    if (checkInDate.isValid() && checkOutDate.isValid()) {
      setErrorMessage("");
    }
  };
  const handleClearSearch = () => {
    setSearchQuery({
      checkInDate: "",
      checkOutDate: "",
      roomType: "",
    });
    setAvailableRooms([]);
  };

  return (
    <>
      <Container className="shadow mt-n5 mb-5 py-5">
        <Form onSubmit={handleSearch}>
          <Row className="justify-content-center">
            <Col xs={12} md={3}>
              <Form.Group controlId="checkInDate">
                <Form.Label>Arrivée</Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={searchQuery.checkInDate}
                  onChange={handleInputChange}
                  min={dayjs().format("YYYY-MM-DD")}
                  //  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="checkOutDate">
                <Form.Label>Départ</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOutDate"
                  value={searchQuery.checkOutDate}
                  onChange={handleInputChange}
                  min={dayjs().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="roomType">
                <Form.Label>Type de chambre</Form.Label>
                <div className="d-flex">
                  <RoomTypeSelector
                    handleRoomInputChange={handleInputChange}
                    newRoom={searchQuery}
                  />
                  <Button variant="secondary" type="submit" className="ml-2">
                    Rechercher
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {isLoading ? (
          <p className="mt-4">
            Recherche des chambres disponibles en cours....
          </p>
        ) : availableRooms ? (
          <RoomSearchResults
            results={availableRooms}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <p className="mt-4">
            Aucune chambre disponible pour les dates et le type de chambre
            sélectionnés.
          </p>
        )}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </Container>
    </>
  );
};

export default RoomSearch;
