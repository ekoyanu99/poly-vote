import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {TbError404} from "react-icons/tb";

import Home from './pages/Home';
import AddCandidate from './pages/admin/AddCandidate';
import Verification from './pages/admin/Verification';

import Voting from './pages/Voting';
import Results from './pages/Result';
import Registration from './pages/Registration';

import { Footer,Navbar } from './components';

import './index.css';

export default class App extends Component {
  render() {
    return (
      <div className='gradient-bg-welcome'>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/AddCandidate" component={AddCandidate} />
            <Route exact path="/Voting" component={Voting} />
            <Route exact path="/Results" component={Results} />
            <Route exact path="/Registration" component={Registration} />
            <Route exact path="/Verification" component={Verification} />
            <Route exact path="/*" component={NotFound} />
          </Switch>
        </Router>
        <Footer />
      </div>
    )
  }
}

class NotFound extends Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="p-8 text-white text-center">
            <h4 className="text-3xl">Not Found</h4>
            <TbError404 fontSize={128} className="mx-auto text-white  text-center" />
          </div>
        </div>
        <h1>404 NOT FOUND!</h1>
      </>
    );
  }
}