import { useState, useEffect, useRef } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import NotInit from "../../components/NotInit";
import { Chart } from "chart.js/auto";
const Election_ABI = require("../../utils/Election.json");

export default function Voting() {

    // Contract Address & ABI Election
    const contractAddress = "0xb6D23ea1244CeF11a1f97bF545843e69f6124AeB";
    const contractABI = Election_ABI.abi;

    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const [isLoading, setisLoading] = useState(false);
    const [elStarted, setelStarted] = useState(false);
    const [elEnded, setelEnded] = useState(false);
    const [candidateCount, setcandidateCount] = useState(0);
    const [candidates, setcandidates] = useState([]);
    const [winner, setwinner] = useState([]);

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const data = {
                labels: candidates.map(c => c.header),
                datasets: [
                    {
                        label: "Votes",
                        data: candidates.map(c => c.voteCount),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
                        ],
                        borderWidth: 1
                    }
                ]
            };
            const options = {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            }
                        }
                    ]
                }
            };
            chartRef.current = new Chart(ctx, {
                type: "bar",
                data: data,
                options: options
            });
        } else {
            console.error("canvas didn't exist");
        }
    }, [candidates]);

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
                fetchCandidatesDetail();
            }
            if (end === true) {
                getWinner();
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
                    voteCount: candidate.voteCount.toNumber(),
                });
            }

            setcandidates(loadedCandidates);

        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    const getWinner = async () => {
        try {
            // Returns an object having maxium vote count
            let maxVoteRecived = 0;
            let winnerCandidate = [];
            for (let i = 0; i < candidates.length; i++) {
                if (candidates[i].voteCount > maxVoteRecived) {
                    maxVoteRecived = candidates[i].voteCount;
                    winnerCandidate = [candidates[i]];
                } else if (candidates[i].voteCount === maxVoteRecived) {
                    winnerCandidate.push(candidates[i]);
                }
            }
            setwinner(winnerCandidate);
        } catch (error) {
            console.error(error);
        }
    }

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
                                <div className="item-center">
                                    {candidates.length < 1 ? (
                                        <div className="loader">
                                            <center className='text-white'>No candidates.</center>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="loader">
                                                <div className='flex w-full justify-center items-center'>
                                                    <h3 className='text-white'>Temporary Results | Total candidates: {candidates.length}</h3>
                                                </div>
                                                <div className="flex justify-center items-center w-3/4 mx-auto ">
                                                    <div style={{ maxWidth: '100%', width: '100%' }}>
                                                        <canvas ref={canvasRef} id="myChart" height={200}></canvas>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : !elStarted && elEnded ? (
                                <>
                                    {candidates.length > 0 ? (
                                        <div className="container-main">
                                            <div className="flex flex-col items-center justify-center p-5 text-center">
                                                <div className="text-2xl font-bold text-red-500">Winner!</div>
                                                <div className="text-xl font-bold mt-2 text-white">{winner.header}</div>
                                                <div className="text-base mt-2 text-white">{winner.slogan}</div>
                                                <div className="flex mt-5">
                                                    <div className="text-sm font-medium mr-2 text-white">Total Votes:</div>
                                                    <div className="text-sm font-medium text-red-500">{winner.voteCount}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="item-center">
                                        {candidates.length < 1 ? (
                                            <div className="loader">
                                                <center className='text-white'>No candidates.</center>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-center items-center w-3/4 mx-auto ">
                                                    <canvas ref={canvasRef} id="myChart" width={400} height={300}></canvas>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : null}
                        </div>

                    </div>
                </>)}
        </>
    );
}