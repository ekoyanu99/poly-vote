import React, { Component } from 'react';

import {Navbar,NavbarAdmin, Loader, AdminOnly} from '../../components';

import getWeb3 from '../../getWeb3';
import Election from '../../utils/Election.json';

export default class AddCandidate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            web3: null,
            accounts: null,
            isAdmin: false,
            header: "",
            slogan: "",
            candidates: [],
            candidateCount: undefined,
        };
    }

    componentDidMount = async () => {
        // refreshing page only once
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

            // Total number of candidates
            const candidateCount = await this.state.ElectionInstance.methods
                .getTotalCandidate()
                .call();
            this.setState({ candidateCount: candidateCount });

            const admin = await instance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({ isAdmin: true });
            }

            // Loading Candidates details
            for (let i = 0; i < this.state.candidateCount; i++) {
                const candidate = await this.state.ElectionInstance.methods
                    .candidateDetails(i)
                    .call();
                this.state.candidates.push({
                    id: candidate.candidateId,
                    header: candidate.header,
                    slogan: candidate.slogan,
                });
            }

            this.setState({ candidates: this.state.candidates });
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details.`
            // );
        }
    };
    updateHeader = (event) => {
        this.setState({ header: event.target.value });
    };
    updateSlogan = (event) => {
        this.setState({ slogan: event.target.value });
    };

    addCandidate = async () => {
        await this.state.ElectionInstance.methods
            .addCandidate(this.state.header, this.state.slogan)
            .send({ from: this.state.account });
        window.location.reload();
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
                    <AdminOnly page="Add Candidate Page." />
                </>
            );
        }
        return (
            <>
                <div className='min-h-screen'>
                    <NavbarAdmin />
                    <div className="gradient-bg-services">
                        <div className='flex w-full justify-center items-center'>
                            <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
                                <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                                    <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                                        <h2 className='text-xl sm:text-3xl text-white text-gradient py-1'>Add a new candidate</h2>
                                        <small className='text-white'>Total candidates: {this.state.candidateCount}</small>
                                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                                            <form className="form">
                                                <div className="mb-3">
                                                    <label className={`label-ac text-white`}>
                                                        Header
                                                        <input
                                                            className={`input-ac my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism`}
                                                            type="text"
                                                            placeholder="eg. Marcus"
                                                            value={this.state.header}
                                                            onChange={this.updateHeader}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="mb-3">
                                                    <label className={`label-ac text-white`}>
                                                        Slogan
                                                        <input
                                                            className={`input-ac my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism`}
                                                            type="text"
                                                            placeholder="eg. It is what it is"
                                                            value={this.state.slogan}
                                                            onChange={this.updateSlogan}
                                                        />
                                                    </label>
                                                </div>
                                                <button
                                                    type='button'
                                                    className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer"
                                                    disabled={
                                                        this.state.header.length < 3 || this.state.header.length > 21
                                                    }
                                                    onClick={this.addCandidate}
                                                >
                                                    Add
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            {loadAdded(this.state.candidates)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export function loadAdded(candidates) {
    const renderAdded = (candidate) => {
        return (
            <>
                <div className="container-list success">
                    <div>
                        {candidate.id}. <strong>{candidate.header}</strong>:{" "}
                        {candidate.slogan}
                    </div>
                </div>
            </>
        );
    };
    return (
        <div className='flex w-full justify-center items-center'>
            <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
                <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                    <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                        <h4 className='text-xl sm:text-3xl text-white text-gradient py-1'>Candidates List</h4>
                        {candidates.length < 1 ? (
                            <h6 className='text-xl text-white py-1'>No candidates added.</h6>
                        ) : (
                            <div className='text-white'>
                                {candidates.map(renderAdded)}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
