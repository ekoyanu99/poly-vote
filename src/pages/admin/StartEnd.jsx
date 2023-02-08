import React, { Component } from 'react';

import {Navbar,NavbarAdmin, Loader, AdminOnly} from '../../components';

import getWeb3 from '../../getWeb3';
import Election from '../../utils/Election.json';

import '../../index.css';

export default class StartEnd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            web3: null,
            accounts: null,
            isAdmin: false,
            elStarted: false,
            elEnded: false,
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

            // Admin info
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({ isAdmin: true });
            }

            // Get election start and end values
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({ elStarted: start });
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({ elEnded: end });
        } catch (error) {
            // Catch any errors for any of the above operations.
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details.`
            // );
            console.error(error);
        }
    };

    startElection = async () => {
        await this.state.ElectionInstance.methods
            .startElection()
            .send({ from: this.state.account, gas: 1000000 });
        window.location.reload();
    };
    endElection = async () => {
        await this.state.ElectionInstance.methods
            .endElection()
            .send({ from: this.state.account, gas: 1000000 });
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
                    <AdminOnly page="Start and end election page." />
                </>
            );
        }
        return (
            <>
                <NavbarAdmin />
                {!this.state.elStarted & !this.state.elEnded ? (
                    <div className="">
                        <center>The election have never been initiated.</center>
                    </div>
                ) : null}
                <div className="flex justify-center items-center h-screen">
                    <h3>Start or end election</h3>
                    {!this.state.elStarted ? (
                        <>
                            <button type='button' onClick={this.startElection} className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#2952e3] rounded-full cursor-pointer">
                                    Start {this.state.elEnded ? "Again" : null}
                            </button>
                            {this.state.elEnded ? (
                                <div className="">
                                    <center>
                                        <p>The election ended.</p>
                                    </center>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <div className="">
                                <center>
                                    <p className='text-white'>The election started.</p>
                                </center>
                            </div>
                            <button type='button' onClick={this.endElection} className="text-white w-full mt-2 border-[1px] p-2 border-[#fffff0] hover:bg-[#ff0000] rounded-full cursor-pointer">
                                    End
                                </button>
                        </>
                    )}
                </div>
            </>
        );
    }
}
