Checkout the wesbite at https://shared-spotify-playlist.herokuapp.com/

## Goal
- Uses Spotify API to get songs from a shared playlist, that were added in the last week, so that my friends can rate them.
- At the end of the week, the results are shown per song and per user, to get an overall winner.
- The top 5 songs are kept, and the rest are removed.

## Acknowledgements of Features
- Drag and drop feature for selecting order of songs using [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- UI using [Material UI](https://material-ui.com/)
- Webhosting using [Heroku](https://www.heroku.com/)
- Data stored in Heroku using [postgreSQL](https://www.heroku.com/postgres)
- View everyone's vote in google sheets (i.e NoSQL archive)
- Backend using JS in another [repo](https://github.com/Guppy16/spotify-playlist-backend)

## TODO
- FRONTEND
  - Confirm button
  - Web page to view these results [May need to create a separate website and page for this]
  - Highlight top song and user
  - Use refresh token
  - x-button when using filter
  - Acknowledgements: heroku, material ui, react-beautiful-dnd
  - Change time mins in playlist data
  - Keep record of data of playlists in the past to view past weeks
  - Delete songs not in top 10
- SERVER
  - Abstract functions from server
  - Give frontend accessToken ONLY. Use that as own authentication for DB, instead of giving them userid
- ARCHIVE
  - Need premium access to:
    - Play music by clicking on the play button on the list: Need premium access
    - Play top song after all results are in

## Notes for Development
- After modifications, git commit your changes & git push heroku master
- To add spotify credentials for authentication during development (using cmd):
  - SET SPOTIFY_CLIENT_ID=***
  - SET SPOTIFY_CLIENT_SECRET=***
  
***
## Leftover MD from React App
  
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
