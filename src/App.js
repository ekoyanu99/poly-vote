import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Home = lazy(()=>import('./component/Home'));
// const test = lazy(()=>import('./component/test')); 
// const AddCandidate = lazy(()=>import('./component/Admin/AddCandidate/AddCandidate'));
// const Verification = lazy(()=>import('./component/Admin/Verification/Verification'));

// const Voting = lazy(()=>import('./component/Voting/Voting'));
// const Results = lazy(()=>import('./component/Results/Result'));
// const Registration = lazy(()=>import('./component/Registration/Registration'));

// const Footer = lazy(()=>import('./component/Footer/Footer'));

import Home from './component/Home';
import test from './component/test';
import AddCandidate from './component/Admin/AddCandidate/AddCandidate';
import Verification from './component/Admin/Verification/Verification';

import Voting from './component/Voting/Voting';
import Results from './component/Results/Result';
import Registration from './component/Registration/Registration';

import Footer from './component/Footer/Footer';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/AddCandidate" component={AddCandidate} />
            <Route exact path="/Voting" component={Voting} />
            <Route exact path="/Results" component={Results} />
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
        <h1>404 NOT FOUND!</h1>
        <center>
          <p>
            The page your are looking for doesn't exist.
            <br />
            Go to{" "}
            <Link
              to="/"
              style={{ color: "black", textDecoration: "underline" }}
            >
              Home
            </Link>
          </p>
        </center>
      </>
    );
  }
}