import React from "react";
import {Container, Nav, Navbar} from 'react-bootstrap';

import "./Navbar.css";

export default function NavbarAdmin() {
    return (
        <Navbar variant="dark" bg="primary" expand="lg">
            <Container>
                <Navbar.Brand href="/"><i className="fab fa-hive" /> Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-around flex-grow-1 pe-3">
                        <Nav.Link href="/Verification">Verification</Nav.Link>
                        <Nav.Link href="/AddCandidate">Add Candidate</Nav.Link>
                        <Nav.Link href="/Registration"><i className="far fa-registered" /> Registration</Nav.Link>
                        <Nav.Link href="/Voting"><i className="fas fa-vote-yea" /> Voting</Nav.Link>
                        <Nav.Link href="/Results"><i className="fas fa-poll-h" /> Results</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
