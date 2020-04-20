import React from 'react';
import queryString from 'query-string'
import { Link } from "react-router-dom";
import Dashboard from "./DashboardPage.js"

const defaultStyle = {
	color: '#fff', padding: '10px', display: 'inline-block',
}

const backend_uri = window.location.href.includes('localhost')
	? 'http://localhost:8888/login'
	: 'https://shared-playlist-backend.herokuapp.com/login';

function SignIn () {
	return (
		<button onClick={() => window.location = backend_uri}
			onMouseOver={(e) => e.target.style.border = '3px solid #4CAF50'}
			onMouseLeave={(e) => e.target.style.border = '3px solid #fff'}
			style={{
				padding: '20px', fontSize: '50px', borderRadius: '5px', border: '3px solid #fff',
			}}>
			Sign in with Spotify
		</button>
	);
}

export default function LandingPage() {
	// Check if access token exists
	const parsed = queryString.parse(window.location.search);
	const accessTokenExists = parsed.access_token ? true : false;
	return (
		<div style={{ textAlign: 'center', padding: '20px' }}>
			{
				accessTokenExists ? 
					<Dashboard />
				: <SignIn />
			}
		</div>
	);
}