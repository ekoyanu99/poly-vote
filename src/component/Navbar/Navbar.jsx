import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import abi from '../utils/abi';
// //import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';

import "./Navbar.css";

export default function Navbar() {

    const contractConfig = {
        address: '0x98F5295367a8bb813516154A4451978CEab4d059',
        abi,
    };

    const { address, isConnected } = useAccount();
    const [addressadmin, setaddressAdmin] = useState();
    const [isAdmin, setisAdmin] = useState(false);
    const [isUserConnected, setIsUserConnected] = useState(false);

    const {data : getAdmin} = useContractRead({
        ...contractConfig,
        functionName: 'getAdmin',
        watch:true,
    });

    useEffect(() => {
        if(getAdmin){
            setaddressAdmin(getAdmin)
        }
    }, [getAdmin]);

    //console.log(addressadmin);

    useEffect(()=>{
        if(addressadmin === address){
            setisAdmin(true)
        }
    },[addressadmin]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        try {
            setIsUserConnected(isConnected);
        } catch (error) {
            console.log("Error connecting to user", error.message);
        }
    }, [isConnected]);
    console.log(address);

    return (
        <nav>
            <NavLink to="/" className="header">
                <i className="fab fa-hive"></i> Home
            </NavLink>

            <ul
                className="navbar-links"
                style={{ width: "35%", transform: open ? "translateX(0px)" : "" }}
            >
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

                {isUserConnected && isAdmin === true ?
                <><li>
                            <NavLink to="/Verification" activeClassName="nav-active">
                                Verification
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/AddCandidate" activeClassName="nav-active">
                                Add Candidate
                            </NavLink>
                        </li></> : 
                        
                        
                        <></>}
                

            </ul>
            <ul><ConnectButton /></ul>

            {/* {isUserConnected ?
                <>
                    <ul
                        className="navbar-links"
                        style={{ width: "35%", transform: open ? "translateX(0px)" : "" }}
                    >
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
                </>
                :
                <ul>
                    <ConnectButton />
                </ul>
            } */}

            <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
        </nav>
    );
}