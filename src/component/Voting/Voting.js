import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../Navbar/NavbarUser';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import NotInit from '../NotInit';
import Loader from '../Loader';

import getWeb3 from '../../getWeb3';
import Election from '../utils/Election.json';
import PolyVote from '../utils/PolyVote.json'

//import './Voting.css';

export default class Voting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            PolyVoteInstance:undefined,
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

            const deployedNFT = PolyVote.networks[networkId];
            const nftinstance = new web3.eth.Contract(
                PolyVote.abi,
                deployedNFT && deployedNFT.address
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({
                web3: web3,
                ElectionInstance: instance,
                PolyVoteInstance:nftinstance,
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
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">

                <p className="text-white">{candidate.header}</p> <small className='text-white'>#{candidate.id}</small>
                <p className="text-white">{candidate.slogan}</p>

                <button
                    type='button'
                    onClick={() => confirmVote(candidate.id, candidate.header)}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer"
                    disabled={
                        !this.state.currentVoter.isRegistered ||
                        !this.state.currentVoter.isVerified ||
                        this.state.currentVoter.hasVoted
                    }
                >
                    Vote
                </button>
            </div>
        );
    };

    render() {
        if (!this.state.web3) {
            return (
                <>
                    <div className='min-h-screen'>
                        <div className='gradient-bg-welcome'>
                            <Navbar />
                            <Loader />
                        </div>
                    </div>
                </>
            );
        }

        const safeMint = async (address) => {
            await this.state.PolyVoteInstance.methods
                .safeMint(address, "https://ipfs.filebase.io/ipfs/QmT3GBmBEq5Lk5CJjinryw1nLfbsFMFxX4q9tnCx9dELL2")
                .send({ from: this.state.account, gas: 1000000 });
            window.location.reload();
        };

        return (
            <>
                <div className='min-h-screen'>
                    <div>
                        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
                        <div>
                            {!this.state.elStarted && !this.state.elEnded ? (
                                <NotInit />
                            ) : this.state.elStarted && !this.state.elEnded ? (
                                <>
                                    <div className="flex w-full justify-center items-center">
                                        <div className='flex mf:flex-row flex-col items-start justify-between md:p-10 py-6 px-2'>
                                            <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                                                <h2 className='className="text-3xl sm:text-5xl text-white text-gradient py-1'>Candidates</h2>
                                                <small className='text-white'>Total candidates: {this.state.candidates.length}</small>
                                                {this.state.candidates.length < 1 ? (
                                                    <div className="container attention">
                                                        <center className='text-white'>Not one to vote for.</center>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {this.state.candidates.map(this.renderCandidates)}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.currentVoter.isRegistered ? (
                                        this.state.currentVoter.isVerified ? (
                                            this.state.currentVoter.hasVoted ? (
                                                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                                                    <div>
                                                        <p className='text-white font-bold'>You've casted your vote.</p>
                                                        <p />
                                                        <button className='text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'>
                                                            <Link
                                                                to="/Results"
                                                                style={{
                                                                    color: "white",
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                See Results
                                                            </Link>
                                                        </button>
                                                        <p />
                                                        <button 
                                                            className='text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'
                                                            // onClick={() => safeMint("0xa416eCa243f9DC88248b40538Ab47478f4D575E8")}
                                                            onClick={() => safeMint(this.state.account)}
                                                            >
                                                            MintNFT
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="container info">
                                                    <center className='text-white'>Go ahead and cast your vote.</center>
                                                </div>
                                            )
                                        ) : (
                                            <div className="container attention">
                                                <center className='text-white'>Please wait for admin to verify.</center>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <div className="container attention">
                                                <center>
                                                    <p className='text-white'>You're not registered. Please register first.</p>
                                                    <br />
                                                    <Link
                                                        to="/Registration"
                                                        style={{ color: "white", textDecoration: "underline" }}
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
                                    <div className="flex w-full justify-center items-center">
                                        <div className="flex mf:flex-row flex-col items-start justify-between md:p-10 py-6 px-2">
                                            <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                                                <center>
                                                    <h3 className='text-white'>The Election ended.</h3>
                                                    <button className='text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer'>
                                                        <Link
                                                            to="/Results"
                                                            className='text-white'
                                                        >
                                                            See results
                                                        </Link>
                                                    </button>
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

