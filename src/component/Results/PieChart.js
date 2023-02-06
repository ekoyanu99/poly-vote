import React, { useState, useEffect } from 'react';

import Navbar from '../Navbar/NavbarUser';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import NotInit from '../NotInit';
import Loader from '../Loader';

import getWeb3 from '../../getWeb3';
import Election from '../utils/Election.json';

import { Line } from 'react-chartjs-2';

export default function PieChart() {

    const [ElectionInstance, setElectionInstance] = useState(undefined);
    const [account, setaccount] = useState(0)
    const [web3, setweb3] = useState(0)
    const [isAdmin, setisAdmin] = useState(false)
    const [candidateCount, setcandidateCount] = useState(undefined)
    const [candidates, setcandidates] = useState([])
    const [elStarted, setelStarted] = useState(false)
    const [elEnded, setelEnded] = useState(false)

    useEffect(() => {

        async function fetchMy() {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi,
                deployedNetwork && deployedNetwork.address
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            setweb3();
            setElectionInstance(instance);
            setaccount(account[0]);

            // Get total number of candidates
            const candidateCount = await ElectionInstance.methods
                .getTotalCandidate()
                .call();
            setcandidateCount(candidateCount);
            console.log(candidateCount);

            // Get start and end values
            const start = await ElectionInstance.methods.getStart().call();
            setelStarted(start);
            const end = await ElectionInstance.methods.getEnd().call();
            setelEnded(end)

            // Loading Candidates detials
            for (let i = 1; i <= candidateCount; i++) {
                const candidate = await ElectionInstance.methods
                    .candidateDetails(i - 1)
                    .call();
                candidates.push({
                    id: candidate.candidateId,
                    header: candidate.header,
                    slogan: candidate.slogan,
                    voteCount: candidate.voteCount,
                });
            }

            setcandidates(candidates);

            // Admin account and verification
            const admin = await ElectionInstance.methods.getAdmin().call();
            if (account === admin) {
                setisAdmin(true);
            }
        }
        fetchMy();
    });

    return (
        <>
            {/* if (!web3) {
                <>
                    {isAdmin ? <NavbarAdmin /> : <Navbar />}
                    <Loader />
                </>
            } else {
                <>
                    {isAdmin ? <NavbarAdmin /> : <Navbar />}
                    <br />
                    <div>
                        {!elStarted && !elEnded ? (
                            <NotInit />
                        ) : elStarted && !elEnded ? (
                            temporaryResults(candidates)
                        ) : !elStarted && elEnded ? (
                            displayResults(candidates)
                        ) : null}
                    </div>
                </>
            } */}
        </>
    );
}



export function temporaryResults(candidates) {
    const renderResults = (candidate) => {
        return (
            <tr>
                <td>{candidate.id}</td>
                <td>{candidate.header}</td>
                <td>{candidate.voteCount}</td>
            </tr>
        );
    };
    return (
        <>
            <div className="container-main" style={{ borderTop: "1px solid" }}>
                <h2>Temporary Results</h2>
                <small>Total candidates: {candidates.length}</small>
                {candidates.length < 1 ? (
                    <div className="container attention">
                        <center>No candidates.</center>
                    </div>
                ) : (
                    <>
                        <div className="container">
                            <table className='table table-bordered'>
                                <tr>
                                    <th>Id</th>
                                    <th>Candidate</th>
                                    <th>Votes</th>
                                </tr>
                                {candidates.map(renderResults)}
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

function displayWinner(candidates) {
    const getWinner = (candidates) => {
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
        return winnerCandidate;
    };
    const renderWinner = (winner) => {
        return (
            <div className="container-winner">
                <div className="winner-info">
                    <p className="winner-tag">Winner!</p>
                    <h2> {winner.header}</h2>
                    <p className="winner-slogan">{winner.slogan}</p>
                </div>
                <div className="winner-votes">
                    <div className="votes-tag">Total Votes: </div>
                    <div className="vote-count">{winner.voteCount}</div>
                </div>
            </div>
        );
    };
    const winnerCandidate = getWinner(candidates);
    return <>{winnerCandidate.map(renderWinner)}</>;
}

export function displayResults(candidates) {
    const renderResults = (candidate) => {
        return (
            <tr>
                <td>{candidate.id}</td>
                <td>{candidate.header}</td>
                <td>{candidate.voteCount}</td>
            </tr>
        );
    };
    return (
        <>
            {candidates.length > 0 ? (
                <div className="container-main">{displayWinner(candidates)}</div>
            ) : null}
            <div className="container-main" style={{ borderTop: "1px solid" }}>
                <h2>Results</h2>
                <small>Total candidates: {candidates.length}</small>
                {candidates.length < 1 ? (
                    <div className="container attention">
                        <center>No candidates.</center>
                    </div>
                ) : (
                    <>
                        <div className="container">
                            <table className='table table-bordered'>
                                <tr>
                                    <th>Id</th>
                                    <th>Candidate</th>
                                    <th>Votes</th>
                                </tr>
                                {candidates.map(renderResults)}
                            </table>
                        </div>
                        <div
                            className="container"
                            style={{ border: "1px solid black" }}
                        >
                            <center>That is all.</center>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}