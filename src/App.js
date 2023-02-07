import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { BsFillFileLock2Fill } from "react-icons/bs";
import {TbError404} from "react-icons/tb";

import Home from './component/Home';
import test from './component/test';
import AddCandidate from './component/Admin/AddCandidate/AddCandidate';
import Verification from './component/Admin/Verification/Verification';


import Voting from './component/Voting/Voting';
import Results from './component/Results/Result';
// import PieChart from './component/Results/PieChart';
//import TemporaryResults from './component/Results/TemporaryResults';
import Registration from './component/Registration/Registration';

import Footer from './component/Footer/Footer';
import NavbarUser from './component/Navbar/NavbarUser';

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
            {/* <Route exact path="/Results" component={TemporaryResults} /> */}
            {/* <Route exact path="/Results" component={PieChart} /> */}
            <Route exact path="/Registration" component={Registration} />
            <Route exact path="/Verification" component={Verification} />
            <Route exact path="/test" component={test} />
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
        <NavbarUser />
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