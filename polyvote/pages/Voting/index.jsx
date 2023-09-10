import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import NotInit from "../../components/NotInit";
const Election_ABI = require("../../utils/Election.json");
const PolyVote_ABI = require("../../utils/PolyVote.json");

export default function Voting() {

    // Contract Address & ABI Election
    const contractAddress = "0xb6D23ea1244CeF11a1f97bF545843e69f6124AeB";
    const contractABI = Election_ABI.abi;

    // CA & ABI PolyVote
    const PolyCA = "0xbff7d7ffde08c552e182f534d79d9bc48b5998ef";
    const PolyABI = PolyVote_ABI.abi;
    
    const [elStarted, setelStarted] = useState(false);
    const [elEnded, setelEnded] = useState(false);
    const [candidateCount, setcandidateCount] = useState(0);
    const [candidates, setcandidates] = useState([]);
    const [currentVoter, setcurrentVoter] = useState({
        address: undefined,
        name: null,
        phone: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
    });

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

    const checkStart = async () => {
        try {
            const start = await electionInstance.getStart();
            setelStarted(start);
            const end = await electionInstance.getEnd();
            setelEnded(end);
            if (start === true) {
                fetchCurrentVoter();
                fetchCandidatesDetail();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCandidatesDetail = async () => {
        try {
            const cekCount = await electionInstance.getTotalCandidate();
            const totalCandidateCount = cekCount.toNumber();
            setcandidateCount(totalCandidateCount);

            // Loading Candidates details
            const loadedCandidates = [];

            for (let i = 1; i <= cekCount.toNumber(); i++) {
                const candidateIndex = i - 1;
                const candidate = await electionInstance.candidateDetails(candidateIndex);

                loadedCandidates.push({
                    id: candidate.candidateId.toNumber(),
                    header: candidate.header,
                    slogan: candidate.slogan,
                });
            }

            setcandidates(loadedCandidates);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };


    const fetchCurrentVoter = async () => {
        try {
            const voter = await electionInstance.voterDetails(address);

            setcurrentVoter({
                address: voter.voterAddress,
                name: voter.name,
                phone: voter.phone,
                hasVoted: voter.hasVoted,
                isVerified: voter.isVerified,
                isRegistered: voter.isRegistered,
            });

        } catch (error) {
            console.error(error);
        }
    }

    const castVote = async (id) => {
        const castVoteTx = await electionInstance.vote(id);
        await castVoteTx.wait();

        // Refresh the page or update the state as needed
        window.location.reload();
    };

    const confirmVote = (id, header) => {
        const r = window.confirm(
            `Vote for ${header} with Id ${id}.\nAre you sure?`
        );
        if (r === true) {
            castVote(id);
        }
    };

    const safeMint = async (address) => {
        const mintTx = await polyInstance.safeMint(address, "https://ipfs.filebase.io/ipfs/QmRGFGbufiNCoS1vv2x26jxzdjMkEZqkLBo8MSRYqQokfC");

        await mintTx.wait();
        window.location.reload();
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
                    <div className="min-h-screen">
                        <div className="gradient-bg-transactions">
                            {!elStarted && !elEnded ? (
                                <NotInit />
                            ) : elStarted && !elEnded ? (
                                <>
                                    <div className="flex w-full justify-center items-center">
                                        <div className='flex mf:flex-row flex-col items-start justify-between md:p-10 py-6 px-2'>
                                            <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                                                <h2 className='className="text-3xl sm:text-5xl text-white text-gradient py-1'>Candidates</h2>
                                                <small className='text-white'>Total candidates: {candidateCount}</small>
                                                {candidateCount < 1 ? (
                                                    <div className="container attention">
                                                        <center className='text-white'>Not one to vote for.</center>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {candidates.map(candidate => (
                                                            <div key={candidate.id} className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                                                                <p className="text-white">{candidate.header}</p>
                                                                <small className='text-white'>#{candidate.id}</small>
                                                                <p className="text-white">{candidate.slogan}</p>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => confirmVote(candidate.id, candidate.header)}
                                                                    className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer"
                                                                    disabled={
                                                                        !currentVoter.isRegistered ||
                                                                        !currentVoter.isVerified ||
                                                                        currentVoter.hasVoted
                                                                    }
                                                                >
                                                                    Vote
                                                                </button>
                                                            </div>
                                                        ))}

                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {currentVoter.isRegistered ? (
                                        currentVoter.isVerified ? (
                                            currentVoter.hasVoted ? (
                                                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                                                    <div>
                                                        <p className='text-white font-bold'>You've casted your vote.</p>
                                                        <p />
                                                        <button className='text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'>
                                                            <a
                                                                href="/Results"
                                                                style={{
                                                                    color: "white",
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                See Results
                                                            </a>
                                                        </button>
                                                        <p />
                                                        <button
                                                            className='text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'
                                                            // onClick={() => safeMint("0xa416eCa243f9DC88248b40538Ab47478f4D575E8")}
                                                            onClick={() => safeMint(currentAccount)}
                                                        >
                                                            MintNFT
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                                                    <p className='text-white'>Go ahead and cast your vote.</p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                                                <p className='text-white'>Please wait for admin to verify.</p>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">

                                                <p className='text-white'>You're not registered. Please register first.</p>
                                                <br />
                                                <a
                                                    href="/Registration"
                                                    style={{ color: "white", textDecoration: "underline" }}
                                                >
                                                    Registration Page
                                                </a>

                                            </div>
                                        </>
                                    )}
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
                </>)}

        </>
    );
}