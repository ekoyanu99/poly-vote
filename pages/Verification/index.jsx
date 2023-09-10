import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
const Election_ABI = require("../../utils/Election.json");
const PolyVote_ABI = require("../../utils/PolyVote.json");
import CryptoJS from 'crypto-js';
import NotInit from "../../components/NotInit";
import { BsFillFileLock2Fill } from "react-icons/bs";

// Encrypt data using AES encryption
function encryptData(data, secretKey) {
    const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
    return ciphertext;
};

// Decrypt data using AES decryption
function decryptData(ciphertext, secretKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
};

export default function Registration() {

    // Contract Address & ABI
    const contractAddress = "0xb6D23ea1244CeF11a1f97bF545843e69f6124AeB";
    const contractABI = Election_ABI.abi;

    // CA & ABI PolyVote
    const PolyCA = "0xbff7d7ffde08c552e182f534d79d9bc48b5998ef";
    const PolyABI = PolyVote_ABI.abi;

    const [isAdmin, setisAdmin] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [elStarted, setelStarted] = useState(false);
    const [elEnded, setelEnded] = useState(false);
    const [voterCount, setvoterCount] = useState(undefined);
    const [voters, setvoters] = useState([]);
    
    const [secretKey, setsecretKey] = useState(process.env.NEXT_PUBLIC_SECRET_KEY);
    const { data: signer } = useSigner();
    const [currentAccount, setcurrentAccount] = useState(null);

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
            checkAdmin();
            checkStart();
        }
    }, [signer]);

    const electionInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const polyInstance = new ethers.Contract(PolyCA, PolyABI, signer);

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

    const checkAdmin = async () => {
        // Check if signer is available
        if (signer) {
            // const electionContract = new ethers.Contract(contractAddress, contractABI, signer);

            try {
                const admin = await electionInstance.getAdmin();

                if (address === admin) {
                    setisAdmin(true);
                }
            } catch (error) {
                console.error("Error checking admin:", error);
            }
        } else {
            console.warn("Signer not available. Ensure that a wallet is connected.");
        }
    }

    const checkStart = async () => {
        try {
            const start = await electionInstance.getStart();
            setelStarted(start);
            const end = await electionInstance.getEnd();
            setelEnded(end);
            if (start === true) {
                fetchVotersDetail();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchVotersDetail = async () => {
        try {
            const cekCount = await electionInstance.getTotalVoter();
            const totalVoterCount = cekCount.toNumber();
            setvoterCount(totalVoterCount);

            // Loading Candidates details
            const uniqueAddresses = new Set(); // Create a Set to store unique voter addresses
            const newVoters = [];

            for (let i = 1; i <= cekCount.toNumber(); i++) {
                const voterAddress = await electionInstance.voters(i - 1);

                // Check if the address is already in the Set, if not, process the data
                if (!uniqueAddresses.has(voterAddress)) {
                    uniqueAddresses.add(voterAddress);

                    const voter = await electionInstance.voterDetails(voterAddress);
                    const decryptedName = decryptData(voter.name, secretKey);
                    const decryptedPhone = decryptData(voter.phone, secretKey);

                    newVoters.push({
                        address: voter.voterAddress,
                        name: decryptedName,
                        phone: decryptedPhone,
                        hasVoted: voter.hasVoted,
                        isVerified: voter.isVerified,
                        isRegistered: voter.isRegistered,
                    });
                }
            }

            setvoters(newVoters);
        } catch (error) {
            console.error("Error fetching voter:", error);
        }
    };


    const verifyUser = async (verifiedStatus, address) => {
        try {

            const verifyVoter = await electionInstance.verifyVoter(verifiedStatus, address);

            await verifyVoter.wait();

            const verifyWhitelist = await polyInstance.addWhiteList(address)

            await verifyWhitelist.wait();

            window.location.reload();

        } catch (error) {
            console.error("Error verifying user:", error);
        }
    };

    const VoterTable = ({ voters, verifyUser, verified }) => {
        return (
            <div className='sm:flex flex-1 justify-start items-center flex-col mf:mr-10 sm:flex-col'>
                <table className={`table text-center border-separate border-spacing-2 border border-slate-500 ${companyCommonStyles}`}>
                    <thead>
                        <tr>
                            <th>Detail</th>
                            {!verified && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {voters.map((voter) => (
                            <tr key={voter.address}>
                                <tr>
							<th className='border border-slate-600'>Account Address</th>
							<td className='border border-slate-600 '>
								<div className="overflow-x-auto max-w-[200px] md:max-w-[none]">
									{voter.address}
								</div>
							</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Name</th>
							<td className='border border-slate-600'>{voter.name}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Phone</th>
							<td className='border border-slate-600'>{voter.phone}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Voted</th>
							<td className='border border-slate-600'>{voter.hasVoted ? "True" : "False"}</td>
						</tr>
						<tr>
							<th className='border border-slate-600'>Verification</th>
							<td className='border border-slate-600'>{voter.isVerified ? "True" : "False"}</td>
						</tr>
                                {!verified && !voter.isVerified && (
                                    <td>
                                        <button
                                            type='button'
                                            className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-half cursor-pointer"
                                            onClick={() => verifyUser(true, voter.address)}
                                        >
                                            Approve
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            {isDisconnected ?
                (<>
                    <div className="min-h-screen">
                        <div className="loader">
                            <p className="text-white font-semibold text-lg mt-1"> Please connect your wallet </p>
                        </div>
                    </div>
                </>) :
                (<>
                    {!isAdmin ? (
                        <>
                            <div className="flex justify-center items-center h-screen">
                                <div className="p-8 text-white text-center">
                                    <h1 className="text-3xl">Verification</h1>
                                    <p className="text-xl">Admin access only.</p>
                                    <BsFillFileLock2Fill fontSize={64} className="mt-5 mx-auto text-white  text-center" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="min-h-screen">
                                <div className="gradient-bg-services loader">
                                    {!elStarted && !elEnded ? (
                                        <NotInit />
                                    ) : elStarted && !elEnded ? (
                                        <>
                                            <div className="min-h-screen flex flex-col justify-center items-center">
                                                <div className='flex flex-col w-full items-center justify-start'>
                                                    <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                                                        <h3 className='text-white text-3xl font-bold mb-4'>Verification</h3>
                                                        <small className='text-white'>Total Voters: {voters.length}</small>
                                                        <div className='flex flex-col w-full items-center justify-start mt-8'>
                                                            {voters.length < 0 ? (
                                                                <p className="text-white">None has registered yet.</p>
                                                            ) : (
                                                                <>
                                                                    <p className="text-white text-2xl font-bold mb-4">List of Registered Voters</p>
                                                                    <div className="flex flex-col w-full justify-center items-center">
                                                                        <div className="w-full p-2 flex justify-center">
                                                                            <div className="overflow-x-auto mx-auto">
                                                                                <h2 className="text-white text-center text-lg font-bold mb-4">Unverified Voters</h2>
                                                                                <VoterTable voters={voters.filter((voter) => !voter.isVerified)} verifyUser={verifyUser} verified={false} />
                                                                                <h2 className="text-white text-center text-lg font-bold mb-4 pt-4 mt-4">Verified Voters</h2>
                                                                                <VoterTable voters={voters.filter((voter) => voter.isVerified)} verified={true} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : !elStarted && elEnded ? (
                                        <>
                                            <div className="flex w-full justify-center items-center">
                                                <div className="flex mf:flex-row flex-col items-start justify-between md:p-10 py-6 px-2">
                                                    <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                                                        <center>
                                                            <h3 className='text-white'>The Election ended.</h3>
                                                            <button className='text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'>
                                                                <a
                                                                    to="/Results"
                                                                    className='text-white'
                                                                >
                                                                    See results
                                                                </a>
                                                            </button>
                                                        </center>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </div>

                            </div>
                        </>
                    )}
                </>)}
        </>
    );
}

const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";