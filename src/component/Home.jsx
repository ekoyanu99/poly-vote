import React, { Component, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import NavbarAdmin from "./Navbar/NavbarAdmin";

const Home = () => {
    
    return (
        <>
            <Navbar />
            <div className="Home"> 
                Ini Home
            </div>
        </>
    );
}

export default Home