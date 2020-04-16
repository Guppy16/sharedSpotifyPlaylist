import React from 'react';
import { Link } from "react-router-dom";

const defaultStyle = {
  color: '#fff', padding: '10px', display: 'inline-block', 
}

const backend_uri = window.location.href.includes('localhost')
	? 'http://localhost:8888/login' 
	: 'https://shared-playlist-backend.herokuapp.com/login';

export default function LandingPage () {
	return (
		<div style={{textAlign:'center', padding: '20px'}}>
			<button onClick={() => window.location = backend_uri}
				onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
				onMouseLeave={ (e) => e.target.style.border='3px solid #fff' }
				style={{
					padding: '20px', fontSize: '50px', borderRadius: '5px', border: '3px solid #fff', 
			}}>
				Sign in with Spotify
			</button>
		</div>
	);
}