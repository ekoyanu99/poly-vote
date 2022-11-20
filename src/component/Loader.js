import React from 'react';
import { Spin } from 'antd';
import './Loader.css';

const Loader = () => (
    <div className="loader">
        <Spin tip='Loading, please wait or refresh once...' />
    </div>
);

export default Loader;