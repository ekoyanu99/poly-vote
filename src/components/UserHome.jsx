import React from "react";
import { SiHiveBlockchain } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import {shortenAddress} from '../utils/shortenAddress'

import '../index.css';

const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

function UserHome(props) {
    const account = props.account;
    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Evoting <br /> use Blockchain Tech
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, odio animi magnam, unde nostrum tempora sit eum ipsa iusto quibusdam architecto. Quibusdam earum pariatur corporis provident ducimus nam vitae soluta?
                    </p>

                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                            Reliability
                        </div>
                        <div className={companyCommonStyles}>Security</div>
                        <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                            Polygon
                        </div>
                        <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                            Web 3.0
                        </div>
                        <div className={companyCommonStyles}>Low Fees</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                            Blockchain
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <SiHiveBlockchain fontSize={21} color="#fff" />
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" />
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">
                                    {shortenAddress(account)}
                                </p>
                                <p className="text-white font-semibold text-lg mt-1">
                                    Polygon
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <h3 className="mt-2 text-white text-lg">Details Admin & Election</h3>
                        <hr class="w-64 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
                        <p className="mt-1 text-white text-sm md:w-9/12">Admin Name : {props.el.adminName}</p>
                        <p className="mt-1 text-white text-sm md:w-9/12">Admin Email : {props.el.adminEmail}</p>
                        <p className="mt-1 text-white text-sm md:w-9/12">Role : {props.el.adminTitle}</p>
                        <p className="mt-1 text-white text-sm md:w-9/12">Election Title : {props.el.electionTitle}</p>
                        <p className="mt-1 text-white text-sm md:w-9/12">Organization : {props.el.organizationTitle}</p>
                        <p className="mt-1 text-white text-sm md:w-9/12">Status Election : {props.el.elStart ? (<>False</>) : (<>True</>)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserHome;
