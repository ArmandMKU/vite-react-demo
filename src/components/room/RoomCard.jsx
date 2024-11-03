import React, { useContext, useState } from "react"
import { Card, Col } from "react-bootstrap"
import {Modal, Button, Carousel} from 'react-bootstrap'
import { Link } from "react-router-dom"

const RoomCard = ({ room }) => {

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Col key={room.id} className="mb-4" xs={12}>
			<Card>
				<Card.Body className="d-flex flex-wrap align-items-center">
					<div className="flex-shrrink-0 mr-3 mb-3 mb-md-0">
						<Link to={`/book-room/${room.id}`}>
							<Card.Img
								variant="top"
								src={`data:image/png;base64, ${room.images[0]}`}
								alt="Room Photo"
								style={{ width: "100%", maxWidth: "200px", height: "auto" }}
							/>
						</Link>
					</div>
					<div className="flex-grow-1 ml-3 px-5">
						<Card.Title className="hotel-color">{room.roomType}</Card.Title>
						<Card.Title className="room-price">{room.roomPrice} / nuit</Card.Title>
						<Card.Text>{room.roomDescription}</Card.Text>
					</div>

					<div className="flex-shrink-0 mt-3">
                        <button className='btn btn-hotel btn-sm' onClick={handleShow}>
							Voir Details
						</button>
					</div>

					<div className="flex-shrink-0 mt-3">						
						<Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm">
							Réserver maintenant
						</Link>
					</div>
				</Card.Body>
			</Card>

			<Modal show={show} onHide={handleClose} size='lg'>
				<Modal.Header>
					<Modal.Title>{room.roomType}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Carousel prevLabel='' nextLabel=''>
					{room.images.map(image => {
						return <Carousel.Item>
							<img className='d-block w-100 bigimg' 
							src={`data:image/png;base64, ${image}`}
							/>            
					</Carousel.Item>
					})}
					
					</Carousel>
					<p>{room.description}</p>
				</Modal.Body>
				<Modal.Footer>					
					<button className='btn btn-hotel btn-sm' onClick={handleClose}>
						Close
					</button>       
				</Modal.Footer>
			</Modal>
		</Col>
	)
}

export default RoomCard
