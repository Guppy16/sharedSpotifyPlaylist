/*eslint-disable*/
import React from 'react';
import { Link } from "react-router-dom";

import '../assets/index.css';
import logo from '../assets/logo.svg';

export default function Footer(props){ 
    return (
        <footer className="App-footer">
        <img src={logo} className="App-logo" alt="logo"/>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
            Powered by React
        </a>
        <p>I'm storing cookies whether you like it or not</p>
        </footer>
    );
}