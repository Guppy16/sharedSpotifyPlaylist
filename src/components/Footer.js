/*eslint-disable*/
import React from 'react';
import { Link } from "react-router-dom";

import 'reset-css/reset.css';
import '../assets/index.css';
import logo from '../assets/logo.svg';

export default function Footer(props){ 
    return (
        <footer style={{
            minHeight: "10vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "cener",
            fontSize: "calc(10px + 2vmin)",
            color: "white",
            padding: "20px",
            bottom: "0",
        }}>
        <img src={logo} className="App-logo" alt="logo"/>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
            Powered by React
        </a>
        <p>Turns out I'm not actually storing cookies</p>
        </footer>
    );
}