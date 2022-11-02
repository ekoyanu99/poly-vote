
import React, { Component, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./component/Home";

import Voting from "./component/Voting/Voting";
import Results from "./component/Results/Results";
import Registration from "./component/Registration/Registration";

import AddCandidate from "./component/Admin/AddCandidate/AddCandidate";
import Verification from "./component/Admin/Verification/Verification";
//import test from "./component/test";
// import StartEnd from "./component/Admin/StartEnd/StartEnd";

import Footer from "./component/Footer/Footer";

import "./App.css";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_API_URL }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'PolyVote',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default class App extends Component {
  render() {
    return (
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <div className="App">
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/AddCandidate" component={AddCandidate} />
                <Route exact path="/Voting" component={Voting} />
                <Route exact path="/Results" component={Results} />
                <Route exact path="/Registration" component={Registration} />
                <Route exact path="/Verification" component={Verification} />
                {/* <Route exact path="/test" component={test} />
            <Route exact path="*" component={NotFound} /> */}
              </Switch>
            </Router>
            <Footer />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    );
  }
}