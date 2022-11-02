import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import "./Navbar.css";

export default function NavbarAdmin() {

    const [open, setOpen] = useState(false);

    return (
        <nav>
            <NavLink to="/" className="header">
                <i className="fab fa-hive"></i> Admin
            </NavLink>

            <ul
                        className="navbar-links"
                        style={{ transform: open ? "translateX(0px)" : "" }}
                    >
                        <li>
                            <NavLink to="/Verification" activeClassName="nav-active">
                                Verification
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/AddCandidate" activeClassName="nav-active">
                                Add Candidate
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Registration" activeClassName="nav-active">
                                <i className="far fa-registered" /> Registration
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Voting" activeClassName="nav-active">
                                <i className="fas fa-vote-yea" /> Voting
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Results" activeClassName="nav-active">
                                <i className="fas fa-poll-h" /> Results
                            </NavLink>
                        </li>
                    </ul>
                    <ul><ConnectButton /></ul>

            <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
        </nav>
    );
}