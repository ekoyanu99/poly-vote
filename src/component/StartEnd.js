import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
    const btn = 'text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'
    return (
        // <div className="flex justify-center items-center"></div>
        <div className="justify-center items-center">
            {!props.elStarted ? (
                <>
                    {/* edit here to display start election Again button */}
                    {!props.elEnded ? (
                        <>
                            <div className="mb-3 mt-3">
                                <h2 className="text-white text-center">Do not forget to add candidates.</h2>

                                <button type="button" className={btn}>
                                    <Link
                                        title="Add a new "
                                        to="/addCandidate"
                                        className="text-white"
                                    >
                                        Add Candidate
                                    </Link>
                                </button>
                                <button type="submit" className={btn}>
                                    Start Election {props.elEnded ? "Again" : null}
                                </button>
                            </div>
                        </>
                    ) : (
                        <h3 className="text-white">Re-deploy the contract to start election again.</h3>
                    )}
                    {props.elEnded ? (
                        <center>
                            <p className="text-white">The election ended.</p>
                        </center>
                    ) : null}
                </>
            ) : (
                <>
                    <div className="flex mf:flex-row flex-col items-start justify-between md:p-10 py-6 px-2">
                        <div className="flex w-full justify-center items-center">
                            <center className="flex w-full justify-center items-center">
                                <p className="text-white">The election started.</p>
                            </center>
                            <button
                                type="button"
                                // onClick={this.endElection}
                                onClick={props.endElFn}
                                className={btn}
                            >
                                End
                            </button>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default StartEnd;
