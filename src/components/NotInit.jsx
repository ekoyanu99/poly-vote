// Node module
import React from "react";
import { Spin } from 'antd';
import './Loader.css';

const NotInit = () => {
    return (
        <div className="loader">
            <Spin tip='The election has not been initialize, please wait...' />
        </div>

    );
};
export default NotInit;
