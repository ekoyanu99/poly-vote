import React, { Component } from 'react';

import { Navbar, NavbarAdmin, Loader, AdminOnly } from '../../components';

import getWeb3 from '../../getWeb3';
import Election from '../../utils/Election.json';
import PolyVote from '../../utils/PolyVote.json';

const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

export default class Verification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            PolyVoteInstance: undefined,
            account: null,
            web3: null,
            isAdmin: false,
            voterCount: undefined,
            voters: [],
        };
    }

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

            const deployedNFT = PolyVote.networks[networkId];
            const nftinstance = new web3.eth.Contract(
                PolyVote.abi,
                deployedNFT && deployedNFT.address
            );


            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, ElectionInstance: instance, PolyVoteInstance: nftinstance, account: accounts[0] });

            // Admin account and verification
            const admin = await instance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({ isAdmin: true });
            }

            // Total number of voters
            const voterCount = await this.state.ElectionInstance.methods
                .getTotalVoter()
                .call();
            this.setState({ voterCount: voterCount });

            // Loading all the voters
            const newVoters = [];
            for (let i = 0; i < voterCount; i++) {
                const voterAddress = await this.state.ElectionInstance.methods
                    .voters(i)
                    .call();
                const voter = await this.state.ElectionInstance.methods
                    .voterDetails(voterAddress)
                    .call();
                newVoters.push({
                    address: voter.voterAddress,
                    name: voter.name,
                    phone: voter.phone,
                    hasVoted: voter.hasVoted,
                    isVerified: voter.isVerified,
                    isRegistered: voter.isRegistered,
                });
            }
            this.setState({ voters: newVoters });

            // Total number of candidates
            const candidateCount = await instance.methods
                .getTotalCandidate()
                .call();
            this.setState({ candidateCount: candidateCount });
        } catch (error) {
            // Catch any errors for any of the above operations.
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details.`
            // );
            console.error(error);
        }
    };

    renderUnverifiedVoters = (voter) => {
        const verifyVoter = async (verifiedStatus, address) => {
            await this.state.ElectionInstance.methods
                .verifyVoter(verifiedStatus, address)
                .send({ from: this.state.account, gas: 1000000 });
        };
        const verifyWhitelist = async (address) => {
            await this.state.PolyVoteInstance.methods
                .addWhiteList(address)
                .send({ from: this.state.account, gas: 1000000 });
        };
        const verifyUser = async (verifiedStatus, address) => {
            await verifyVoter(verifiedStatus, address);
            await verifyWhitelist(address);
            window.location.reload();
        }
        return (
            <>
                {voter.isVerified ? (
                    <div className='mt-5'>
                        <table className={`table text-center border-separate border-spacing-2 border border-slate-500 ${companyCommonStyles}`}>
                            <tr>
                                <th>Account address</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Voted</th>
                            </tr>
                            <tr>
                                <td>{voter.address}</td>
                                <td>{voter.name}</td>
                                <td>{voter.phone}</td>
                                <td>{voter.hasVoted ? "True" : "False"}</td>
                            </tr>
                        </table>
                    </div>
                ) :
                    <div className='mt-5'>
                        <table className={`table text-center border-separate border-spacing-2 border border-slate-500 ${companyCommonStyles}`}>

                            <tr>
                                <th>Account address</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Voted</th>
                                <th>Verified</th>
                                <th>Registered</th>
                                <th>Action</th>
                            </tr>
                            <tr>
                                <td>{voter.address}</td>
                                <td>{voter.name}</td>
                                <td>{voter.phone}</td>
                                <td>{voter.hasVoted ? "True" : "False"}</td>
                                <td>{voter.isVerified ? "True" : "False"}</td>
                                <td>{voter.isRegistered ? "True" : "False"}</td>
                                <td>
                                    <button
                                        type='button'
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer"
                                        disabled={voter.isVerified}
                                        onClick={() => verifyUser(true, voter.address)}
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                }
            </>
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
        if (!this.state.isAdmin) {
            return (
                <>
                    <Navbar />
                    <AdminOnly page="Verification Page." />
                </>
            );
        }
        return (
            <>
                <NavbarAdmin />
                <div className="min-h-screen">
                    <div className='flex w-full justify-center items-center'>
                        <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                            <h3 className='text-white'>Verification</h3>
                            <small className='text-white'>Total Voters: {this.state.voters.length}</small>
                            <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                                {this.state.voters.length < 0 ? (
                                    <p className="text-white">None has registered yet.</p>
                                ) : (
                                    <>
                                        <p className='text-white'>List of registered voters</p>
                                        <div className='flex flex-wrap'>
                                            <div className="w-1/3 p-2">
                                                {this.state.voters.map(this.renderUnverifiedVoters)}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

