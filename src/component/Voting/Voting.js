import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../Navbar/NavbarUser';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import NotInit from '../NotInit';
import Loader from '../Loader';

import getWeb3 from '../../getWeb3';
import Election from '../utils/Election.json';

//import './Voting.css';

export default class Voting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            account: null,
            web3: null,
            isAdmin: false,
            candidateCount: undefined,
            candidates: [],
            elStarted: false,
            elEnded: false,
            currentVoter: {
                address: undefined,
                name: null,
                phone: null,
                hasVoted: false,
                isVerified: false,
                isRegistered: false,
            },
        };
    }
    componentDidMount = async () => {
        // refreshing once
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }
        try {
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
            this.setState({
                web3: web3,
                ElectionInstance: instance,
                account: accounts[0],
            });

            // Get total number of candidates
            const candidateCount = await this.state.ElectionInstance.methods
                .getTotalCandidate()
                .call();
            this.setState({ candidateCount: candidateCount });

            // Get start and end values
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({ elStarted: start });
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({ elEnded: end });

            // Loading Candidates details
            for (let i = 1; i <= this.state.candidateCount; i++) {
                const candidate = await this.state.ElectionInstance.methods
                    .candidateDetails(i - 1)
                    .call();
                this.state.candidates.push({
                    id: candidate.candidateId,
                    header: candidate.header,
                    slogan: candidate.slogan,
                });
            }
            this.setState({ candidates: this.state.candidates });

            // Loading current voter
            const voter = await this.state.ElectionInstance.methods
                .voterDetails(this.state.account)
                .call();
            this.setState({
                currentVoter: {
                    address: voter.voterAddress,
                    name: voter.name,
                    phone: voter.phone,
                    hasVoted: voter.hasVoted,
                    isVerified: voter.isVerified,
                    isRegistered: voter.isRegistered,
                },
            });

            // Admin account and verification
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({ isAdmin: true });
            }
        } catch (error) {
            // Catch any errors for any of the above operations.
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details.`
            // );
            console.error(error);
        }
    };

    renderCandidates = (candidate) => {
        const castVote = async (id) => {
            await this.state.ElectionInstance.methods
                .vote(id)
                .send({ from: this.state.account, gas: 1000000 });
            window.location.reload();
        };
        const confirmVote = (id, header) => {
            var r = window.confirm(
                "Vote for " + header + " with Id " + id + ".\nAre you sure?"
            );
            if (r === true) {
                castVote(id);
            }
        };
        return (
            <div className="container">
                <div className='card-group'>
                    <div className="card">
                        <h2>
                            {candidate.header} <small>#{candidate.id}</small>
                        </h2>
                        <p className="slogan">{candidate.slogan}</p>
                        <button
                            onClick={() => confirmVote(candidate.id, candidate.header)}
                            className="btn btn-dark"
                            disabled={
                                !this.state.currentVoter.isRegistered ||
                                !this.state.currentVoter.isVerified ||
                                this.state.currentVoter.hasVoted
                            }
                        >
                            Vote
                        </button>
                    </div>
                    <div className="vote-btn-container">
                    </div>
                </div>
            </div>
        );
    };

    render() {
        if (!this.state.web3) {
            return (
                <>
                    {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
                    <Loader />
                </>
            );
        }

        return (
            <>
                {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
                <div>
                    {!this.state.elStarted && !this.state.elEnded ? (
                        <NotInit />
                    ) : this.state.elStarted && !this.state.elEnded ? (
                        <>
                            <div className="container-main">
                                <h2>Candidates</h2>
                                <small>Total candidates: {this.state.candidates.length}</small>
                                {this.state.candidates.length < 1 ? (
                                    <div className="container attention">
                                        <center>Not one to vote for.</center>
                                    </div>
                                ) : (
                                    <>
                                        {this.state.candidates.map(this.renderCandidates)}
                                    </>
                                )}
                            </div>
                            {this.state.currentVoter.isRegistered ? (
                                this.state.currentVoter.isVerified ? (
                                    this.state.currentVoter.hasVoted ? (
                                        <div className="container success">
                                            <div>
                                                <strong>You've casted your vote.</strong>
                                                <p />
                                                <button className='btn btn-outline-primary'>
                                                    <Link
                                                        to="/Results"
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        See Results
                                                    </Link>
                                                </button>
                                                <p />
                                                <button className='btn btn-outline-primary'>
                                                    <Link
                                                        to="/MintNFT"
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        MintNFT
                                                    </Link>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="container info">
                                            <center>Go ahead and cast your vote.</center>
                                        </div>
                                    )
                                ) : (
                                    <div className="container attention">
                                        <center>Please wait for admin to verify.</center>
                                    </div>
                                )
                            ) : (
                                <>
                                    <div className="container attention">
                                        <center>
                                            <p>You're not registered. Please register first.</p>
                                            <br />
                                            <Link
                                                to="/Registration"
                                                style={{ color: "black", textDecoration: "underline" }}
                                            >
                                                Registration Page
                                            </Link>
                                        </center>
                                    </div>
                                </>
                            )}
                        </>
                    ) : !this.state.elStarted && this.state.elEnded ? (
                        <>
                            <div className="container attention">
                                <center>
                                    <h3>The Election ended.</h3>
                                    <br />
                                    <Link
                                        to="/Results"
                                        style={{ color: "black", textDecoration: "underline" }}
                                    >
                                        See results
                                    </Link>
                                </center>
                            </div>
                        </>
                    ) : null}
                </div>
            </>
        );
    }
}

