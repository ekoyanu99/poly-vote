import React, { Component } from 'react';

import Navbar from '../Navbar/NavbarUser';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import NotInit from '../NotInit';
import Loader from '../Loader';

import getWeb3 from '../../getWeb3';
import Election from '../utils/Election.json';
import Chart from 'chart.js/auto';

export default class TemporaryResults extends Component {
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
        };
    }
    chart = null;

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
            this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

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

            // Loadin Candidates detials
            for (let i = 1; i <= this.state.candidateCount; i++) {
                const candidate = await this.state.ElectionInstance.methods
                    .candidateDetails(i - 1)
                    .call();
                this.state.candidates.push({
                    id: candidate.candidateId,
                    header: candidate.header,
                    slogan: candidate.slogan,
                    voteCount: candidate.voteCount,
                });
            }

            this.setState({ candidates: this.state.candidates });

            // Admin account and verification
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({ isAdmin: true });
            }

            if (this.state.candidates.length === 0) return;

            const ctx = document.getElementById("myChart").getContext("2d");
            const data = {
                labels: this.state.candidates.map(c => c.header),
                datasets: [
                    {
                        label: "Votes",
                        data: this.state.candidates.map(c => c.voteCount),
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
                                beginAtZero: false
                            }
                        }
                    ]
                }
            };
            this.chart = new Chart(ctx, {
                type: "bar",
                data: data,
                options: options
            });

            console.log(data)
            console.log(options)
        } catch (error) {
            // Catch any errors for any of the above operations.
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details.`
            // );
            console.error(error);
        }
    }

    componentWillUnmount() {
        if (this.chart) this.chart.destroy();
    }

    render() {
        
        return (
            <div className="container-main" style={{ borderTop: "1px solid" }}>
                <h2>Temporary Results</h2>
                <small>Total candidates: {this.state.candidates.length}</small>
                {this.state.candidates.length < 1 ? (
                    <div className="container attention">
                        <center>No candidates.</center>
                    </div>
                ) : (
                    <>
                        <div className="container">
                            <canvas id="myChart"></canvas>
                        </div>
                        {/* <canvas id="myChart"/> */}
                    </>
                )}
            </div>
        );
    }
}