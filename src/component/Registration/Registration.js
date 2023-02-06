import React, { Component } from 'react';

import Navbar from '../Navbar/NavbarUser';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import NotInit from '../NotInit';
import Loader from '../Loader';

import getWeb3 from '../../getWeb3';
import Election from '../utils/Election.json';

//import './Registration.css';

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            web3: null,
            account: null,
            isAdmin: false,
            elStarted: false,
            elEnded: false,
            voterCount: undefined,
            voterName: "",
            voterPhone: "",
            voters: [],
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

    // refreshing once
    componentDidMount = async () => {
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

            // Admin account and verification
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({ isAdmin: true });
            }

            // Get start and end values
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({ elStarted: start });
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({ elEnded: end });

            // Total number of voters
            const voterCount = await this.state.ElectionInstance.methods
                .getTotalVoter()
                .call();
            this.setState({ voterCount: voterCount });

            // Loading all the voters
            for (let i = 0; i < 3; i++) {
                const voterAddress = await this.state.ElectionInstance.methods
                    .voters(i)
                    .call();
                const voter = await this.state.ElectionInstance.methods
                    .voterDetails(voterAddress)
                    .call();
                this.state.voters.push({
                    address: voter.voterAddress,
                    name: voter.name,
                    phone: voter.phone,
                    hasVoted: voter.hasVoted,
                    isVerified: voter.isVerified,
                    isRegistered: voter.isRegistered,
                });
            }
            this.setState({ voters: this.state.voters });

            // Loading current voters
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
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details (f12).`
            // );
        }
    };
    updateVoterName = (event) => {
        this.setState({ voterName: event.target.value });
    };
    updateVoterPhone = (event) => {
        this.setState({ voterPhone: event.target.value });
    };
    registerAsVoter = async () => {
        await this.state.ElectionInstance.methods
            .registerAsVoter(this.state.voterName, this.state.voterPhone)
            .send({ from: this.state.account, gas: 1000000 });
        window.location.reload();
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
        return (
            <>

                <div className='min-h-screen'>
                    <div className='gradient-bg-welcome'>
                        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
                    </div>
                    <div className='gradient-bg-services'>
                        {!this.state.elStarted && !this.state.elEnded ? (
                            <NotInit />
                        ) : (
                            <>
                                <div className='flex w-full justify-center items-center'>
                                    <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
                                        <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                                            <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                                                <h5 className='text-xl sm:text-3xl text-white text-gradient py-1'>Register to vote</h5>
                                                <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">

                                                    <input
                                                        className='my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism'
                                                        type="text"
                                                        value={this.state.account}
                                                    />

                                                    <input
                                                        className='my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism'
                                                        type="text"
                                                        placeholder="eg. Ava"
                                                        value={this.state.voterName}
                                                        onChange={this.updateVoterName}
                                                    />
                                                    <input
                                                        className='my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism'
                                                        type="number"
                                                        placeholder="eg. 8231234567"
                                                        value={this.state.voterPhone}
                                                        onChange={this.updateVoterPhone}
                                                    />

                                                    <button
                                                        type='button'
                                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                                        disabled={
                                                            this.state.voterPhone.length !== 10 ||
                                                            this.state.currentVoter.isVerified
                                                        }
                                                        onClick={this.registerAsVoter}
                                                    >
                                                        {this.state.currentVoter.isRegistered
                                                            ? "Update"
                                                            : "Register"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <br/>
                                        <div className='flex flex-1 justify-start items-center flex-col mf:mr-10'>
                                            <div
                                                className="flex flex-1 justify-start items-center flex-col mf:mr-10"
                                                style={{
                                                    borderTop: this.state.currentVoter.isRegistered
                                                        ? null
                                                        : "1px solid",
                                                }}
                                            >
                                                {loadCurrentVoter(
                                                    this.state.currentVoter,
                                                    this.state.currentVoter.isRegistered
                                                )}

                                                <br />
                                                <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                                                    Note
                                                </h1>
                                                <p className="text-left mt-5 text-red-400 font-light md:w-9/12 w-11/12 text-base">
                                                    Make sure your account address and Phone number are correct.
                                                    Admin might not approve your account if the provided Phone number nub does not matches the account address registered in admins catalogue.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    }
}

const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

export function loadCurrentVoter(voter, isRegistered) {
    return (
        <>
            <div
                className='flex flex-1 justify-start items-center flex-col mf:mr-10'
            >
                <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                    Your Registered Info
                </h1>
                <br />
                <div
                    className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'
                >
                    <table className={`table text-center border-separate border-spacing-2 border border-slate-500 ${companyCommonStyles}`}>
                        <tr>
                            <th className='border border-slate-600'>Account Address</th>
                            <td className='border border-slate-600'>{voter.address}</td>
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
                        <tr>
                            <th className='border border-slate-600'>Registered</th>
                            <td className='border border-slate-600'>{voter.isRegistered ? "True" : "False"}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    );
}

