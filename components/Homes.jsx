import { useState, useEffect } from "react";
import { SiHiveBlockchain } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
const Election_ABI = require("../utils/Election.json");
import { shortenAddress } from '../utils/shortenAddress';
// const shortenAddress = require("../utils/shortenAddress");

const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

export default function Homes() {
    const [elStarted, setelStarted] = useState(false);
    const [elEnded, setelEnded] = useState(false);
    const [elDetails, setelDetails] = useState({});

    // Contract Address & ABI
    const contractAddress = "0xb6D23ea1244CeF11a1f97bF545843e69f6124AeB";
    // const contractAddress = "0xF70C3A67FDF9E2ddE0412817b0d938cC01c3767e";
    const contractABI = Election_ABI.abi;
    const { data: signer } = useSigner();
    const [currentAccount, setcurrentAccount] = useState("");

    const { address, isDisconnected } = useAccount({
        onDisconnect() {
            setcurrentAccount(null);
        },
    });

    useEffect(() => {
        checkIfWalletConnected();
    }, [address]);

    useEffect(() => {
        if (signer) {
            checkStart();
        }
    }, [signer]);

    const electionInstance = new ethers.Contract(contractAddress, contractABI, signer);

    const checkIfWalletConnected = async () => {
        try {
            if (!isDisconnected) {
                setcurrentAccount(address);
            } else {
                setcurrentAccount(null);
            } 
        } catch (error) {
            console.error(error);
        }
    }

    const checkStart = async () => {
        try {
            const start = await electionInstance.getStart();
            setelStarted(start);
            const end = await electionInstance.getEnd();
            setelEnded(end);
            if (start === true) {
                fetchElectionDetail();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchElectionDetail = async () => {
        try {
            const adminName = await electionInstance.getAdminName();
            const adminEmail = await electionInstance.getAdminEmail();
            const adminTitle = await electionInstance.getAdminTitle();
            const electionTitle = await electionInstance.getElectionTitle();
            const organizationTitle = await electionInstance.getOrganizationTitle();

            setelDetails({
                adminName: adminName,
                adminEmail: adminEmail,
                adminTitle: adminTitle,
                electionTitle: electionTitle,
                organizationTitle: organizationTitle,
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Evoting <br /> use Blockchain Tech
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Discover the exciting world of blockchain voting with PolyVote. Easily cast your votes and participate in secure elections using smart contract technology on the Polygon blockchain.
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

                {!isDisconnected ? (
                    <>
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
                                            {currentAccount ? (
                                                <>
                                                    {shortenAddress(currentAccount)}
                                                </>
                                            ) : null}
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
                                <p className="mt-1 text-white text-sm md:w-9/12">Admin Name : {elDetails.adminName}</p>
                                <p className="mt-1 text-white text-sm md:w-9/12">Admin Email : {elDetails.adminEmail}</p>
                                <p className="mt-1 text-white text-sm md:w-9/12">Role : {elDetails.adminTitle}</p>
                                <p className="mt-1 text-white text-sm md:w-9/12">Election Title : {elDetails.electionTitle}</p>
                                <p className="mt-1 text-white text-sm md:w-9/12">Organization : {elDetails.organizationTitle}</p>
                                <p className="mt-1 text-white text-sm md:w-9/12">Status Election : {elStarted ? (<>True</>) : (<>False</>)}</p>
                            </div>
                        </div>
                    </>
                )
                    : (

                        <>
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
                                                Your Account
                                            </p>
                                            <p className="text-white font-semibold text-lg mt-1">
                                                Please connect your wallet
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    );
}
