import React from "react";
import { BsFillFileLock2Fill } from "react-icons/bs";

const AdminOnly = (props) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-8 text-white text-center">
                <h1 className="text-3xl">{props.page}</h1>
                <p className="text-xl">Admin access only.</p>
                <BsFillFileLock2Fill fontSize={64} className="mt-5 mx-auto text-white  text-center" />
            </div>
        </div>
    );
};

export default AdminOnly;
