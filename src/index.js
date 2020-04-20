import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import 'reset-css/reset.css';

import Footer from "./components/Footer.js";
import App from './App';
import ResultsPage from './views/ResultsPage.js';
import MylistPage from "./views/MylistPage.js";
import Header from "./components/Header.js";
import LandingPage from "./views/LandingPage.js";
import * as serviceWorker from './serviceWorker';

var hist = createBrowserHistory();
// console.log = console.warn = console.error = () => {};

ReactDOM.render(
  
  <React.StrictMode>
    <Router history={hist}>
      {/* <Header /> */}
      <Switch>
        <Route path="/Mylist" component={MylistPage} />
        <Route path="/Results" component={ResultsPage} />
        <Route path="/" component={LandingPage} />
        <Route component={LandingPage} />
      </Switch>
      <Footer/>
    </Router>    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
