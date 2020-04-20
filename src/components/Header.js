/*eslint-disable*/
import React from 'react';
import { Link } from "react-router-dom";
import PollIcon from '@material-ui/icons/Poll';
import ListIcon from '@material-ui/icons/List';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";


const defaultStyle = {
	color: '#fff', padding: '10px', display: 'inline-block',
}

const useStyles = makeStyles((theme) => ({
	button: {
		marginRight: "10px",
	},
}));

function HeaderButton(props) {

	return (
		<Link to={props.link + window.location.search}>
			<button
				onMouseOver={(e) => e.target.style.border = '3px solid #4CAF50'}
				onMouseLeave={(e) => e.target.style.border = '3px solid #fff'}
				style={{
					...defaultStyle, fontSize: '20px', borderRadius: '3px', border: '3px solid #fff',
					...(props.style ? { color: 'green' } : { color: 'black' }),
				}}
			>
				{props.value}
			</button>
		</Link>
	);
}

export default function Header(props) {
	const classes = useStyles();
	return (
		<header
			style={{
				...defaultStyle, verticalAlign: 'middle',
				display: 'flex', justifyContent: 'space-between'
			}}
		>
			<h1 style={{ display: 'inline-block', padding: '20px', fontSize: '30px' }}>
				Shared Spotify Playlist
			</h1>
			<div>
				<HeaderButton
					link={"/"}
					style={true}
					value={"Home"}
				/>
				<HeaderButton
					link={"/Results"}
					style={true}
					value={"Results"}
				/>
				<HeaderButton
					link={"/Mylist"}
					style={true}
					value={"My List"}
				/>
				<IconButton
					variant="contained"
					color="primary"
					size="small"
					className={classes.button}
				>
					<PollIcon /> </IconButton>
			</div>

		</header>
	);
}