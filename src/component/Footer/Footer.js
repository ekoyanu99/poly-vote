import React from 'react'
import "./Footer.css"

const Footer = () => {
    return (
        <>
            <div className="footer-block"></div>
            <div className="footer">
                <div className="footer-container">
                    <p>
                        View this project on{" "}
                        <a
                            className="profile"
                            href="https://github.com/ekoyanu99"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                    <p>
                        Made with <i className="fas fa-heartbeat" /> by{" "}
                        <a
                            className="profile"
                            href="https://www.linkedin.com/in/eko-yanuarso-budi/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Eko Yanuarso Budi
                        </a>
                        .
                    </p>
                </div>
            </div>
        </>
    )
}

export default Footer