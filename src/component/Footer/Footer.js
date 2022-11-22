import React from 'react'
import "./Footer.css"

const Footer = () => {
    return (
        <>
            <footer class="text-center text-white fixed-bottom bg-primary">
                <div className='container p-2 pb-2'>
                    <div className='row'>
                        <div className='col-6 mr-2'>
                            <a
                                className="btn btn-outline-light btn-floating m-1"
                                href="https://www.linkedin.com/in/eko-yanuarso-budi/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a
                                className="btn btn-outline-light btn-floating m-1"
                                href="https://github.com/ekoyanu99"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i class="fab fa-github"></i>
                            </a>
                        </div>
                        <div className='col m-2'>
                            Made with <i className="fas fa-heartbeat" /> by PolyVote Team
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer