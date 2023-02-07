import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
    const btn = 'text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'
    return (
        <div className="flex justify-center items-center">
            {!props.elStarted ? (
                <>
                    {/* edit here to display start election Again button */}
                    {!props.elEnded ? (
                        <>
                            <div>
                                <h2 className="text-white">Do not forget to add candidates.</h2>
                                <p className="text-white">
                                    Go to{" "}
                                    <Link
                                        title="Add a new "
                                        to="/addCandidate"
                                        className="text-white"
                                    >
                                        add candidates
                                    </Link>{" "}
                                    page.
                                </p>
                                <button type="submit" className={btn}>
                                    Start Election {props.elEnded ? "Again" : null}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <center>
                                <p className="text-white">Re-deploy the contract to start election again.</p>
                            </center>
                        </div>
                    )}
                    {props.elEnded ? (
                        <div>
                            <center>
                                <p className="text-white">The election ended.</p>
                            </center>
                        </div>
                    ) : null}
                </>
            ) : (
                <>
                    <div>
                        <center>
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
                </>
            )}
        </div>
    );
};

export default StartEnd;
