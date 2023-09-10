import { useState, useEffect } from "react";
import { SiHiveBlockchain } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
const Election_ABI = require("../utils/Election.json");
import { shortenAddress } from '../utils/shortenAddress';
// const shortenAddress = require("../utils/shortenAddress");
import { useForm } from "react-hook-form";
import Homes from "./Homes";

const btn = 'text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer';

export default function AdminHomes() {

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

    // end election
    const endElection = async () => {
        const endTx = await electionInstance.endElection()
        
        await endTx.wait();

        window.location.reload();
    };
    // register and start election
    const registerElection = async (data) => {
        const registElectionTx = await electionInstance.setElectionDetails(
                data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
                data.adminEmail.toLowerCase(),
                data.adminTitle.toLowerCase(),
                data.electionTitle.toLowerCase(),
                data.organizationTitle.toLowerCase()
        );
        
        await registElectionTx.wait();

        window.location.reload();
    };

    // Contains of Home page for the Admin
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        registerElection(data);
    };

    return (

        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-10 py-6 px-2">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {!elStarted & !elEnded ? (
                                <div className="p-2 sm:w-96 w-full flex flex-col justify-start items-center white-glassmorphism">
                                    {/* about-admin */}
                                    <div className="about-admin">
                                        <h2 className='text-white text-center'>About Admin</h2>
                                        <div className="mb-3">
                                            <div>
                                                <label className="label-home text-white">
                                                    Full Name{" "}
                                                    {errors.adminFName && <EMsg msg="*required" />}
                                                    <input
                                                        className="input-home my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
                                                        type="text"
                                                        placeholder="First Name"
                                                        {...register("adminFName", {
                                                            required: true,
                                                        })}
                                                    />
                                                    <input
                                                        className="input-home my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
                                                        type="text"
                                                        placeholder="Last Name"
                                                        {...register("adminLName")}
                                                    />
                                                </label>

                                                <label className="label-home text-white">
                                                    Email{" "}
                                                    {errors.adminEmail && (
                                                        <EMsg msg={errors.adminEmail.message} />
                                                    )}
                                                    <input
                                                        className="input-home my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
                                                        placeholder="eg. you@example.com"
                                                        name="adminEmail"
                                                        {...register("adminEmail", {
                                                            required: "*Required",
                                                            pattern: {
                                                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // email validation using RegExp
                                                                message: "*Invalid",
                                                            },
                                                        })}
                                                    />
                                                </label>

                                                <label className="label-home text-white">
                                                    Job Title or Position{" "}
                                                    {errors.adminTitle && <EMsg msg="*required" />}
                                                    <input
                                                        className="input-home my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
                                                        type="text"
                                                        placeholder="eg. HR Head "
                                                        {...register("adminTitle", {
                                                            required: true,
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* about-election */}
                                    <div className="about-election">
                                        <h2 className='text-white text-center'>About Election</h2>
                                        <div className="mt-3">
                                            <div>
                                                <label className="label-home text-white">
                                                    Election Title{" "}
                                                    {errors.electionTitle && <EMsg msg="*required" />}
                                                    <input
                                                        className="input-home my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
                                                        type="text"
                                                        placeholder="eg. School Election"
                                                        {...register("electionTitle", {
                                                            required: true,
                                                        })}
                                                    />
                                                </label>
                                                <label className="label-home text-white">
                                                    Organization Name{" "}
                                                    {errors.organizationName && <EMsg msg="*required" />}
                                                    <input
                                                        className="input-home my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
                                                        type="text"
                                                        placeholder="eg. Lifeline Academy"
                                                        {...register("organizationTitle", {
                                                            required: true,
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : elStarted ? (
                                <Homes el={elDetails} account={currentAccount} />
                            ) : null}
                            
                            <div className="justify-center items-center">
                                {!elStarted ? (
                                    <>
                                        {!elEnded ? (
                                            <>
                                                <div className="mb-3 mt-3">
                                                    <h2 className="text-white text-center">Do not forget to add candidates.</h2>

                                                    <button type="button" className={btn}>
                                                        <a
                                                            title="Add a new "
                                                            href="/addCandidate"
                                                            className="text-white"
                                                        >
                                                            Add Candidate
                                                        </a>
                                                    </button>
                                                    <button type="submit" className={btn}>
                                                        Start Election {elEnded ? "Again" : null}
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <h3 className="text-white">Re-deploy the contract to start election again.</h3>
                                        )}
                                        {elEnded ? (
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
                                                    onClick={endElection}
                                                    className={btn}
                                                >
                                                    End
                                                </button>
                                            </div>
                                        </div>

                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};