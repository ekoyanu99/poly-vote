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
                    {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
                    <Loader />
                </>
            );
        }
        return (
            <>
                {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
                {!this.state.elStarted && !this.state.elEnded ? (
                    <NotInit />
                ) : (
                    <>
                        <div className='container pb-2 pt-10'>
                            <div className='row'>
                                <div className='col-lg-6 pb-2 mb-2'>
                                    <div className="">
                                        <h5>Registration</h5>
                                        <small>Register to vote.</small>
                                        <div className="container-item">
                                            <form>
                                                <div className="mb-3">
                                                    <label className={"form-label"}>
                                                        Account Address
                                                        <input
                                                            className={"form-control"}
                                                            type="text"
                                                            value={this.state.account}
                                                            style={{ width: "400px" }}
                                                        />{" "}
                                                    </label>
                                                </div>
                                                <div className="mb-3">
                                                    <label className={"form-label"}>
                                                        Name
                                                        <input
                                                            className={"form-control"}
                                                            type="text"
                                                            placeholder="eg. Ava"
                                                            value={this.state.voterName}
                                                            onChange={this.updateVoterName}
                                                        />{" "}
                                                    </label>
                                                </div>
                                                <div className="mb-3">
                                                    <label className={"form-label"}>
                                                        Phone number <span style={{ color: "tomato" }}>*</span>
                                                        <input
                                                            className={"form-control"}
                                                            type="number"
                                                            placeholder="eg. 8231234567"
                                                            value={this.state.voterPhone}
                                                            onChange={this.updateVoterPhone}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="note">
                                                    <span style={{ color: "tomato" }}> Note: </span>
                                                    <br /> Make sure your account address and Phone number are
                                                    correct. <br /> Admin might not approve your account if the
                                                    provided Phone number nub does not matches the account
                                                    address registered in admins catalogue.
                                                </p>
                                                <button
                                                    className="btn-add btn btn-primary"
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
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6 pt-2 mt-2'>
                                    <div
                                        className="container-main"
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
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </>
        );
    }
}
export function loadCurrentVoter(voter, isRegistered) {
    return (
        <>
            <div
                className={"container-item " + (isRegistered ? "success" : "attention")}
            >
                <center>Your Registered Info</center>
            </div>
            <br></br>
            <div
                className={"container-list " + (isRegistered ? "success" : "attention")}
            >
                <table className='table'>
                    <tr>
                        <th>Account Address</th>
                        <td>{voter.address}</td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td>{voter.name}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>{voter.phone}</td>
                    </tr>
                    <tr>
                        <th>Voted</th>
                        <td>{voter.hasVoted ? "True" : "False"}</td>
                    </tr>
                    <tr>
                        <th>Verification</th>
                        <td>{voter.isVerified ? "True" : "False"}</td>
                    </tr>
                    <tr>
                        <th>Registered</th>
                        <td>{voter.isRegistered ? "True" : "False"}</td>
                    </tr>
                </table>
            </div>
        </>
    );
}

