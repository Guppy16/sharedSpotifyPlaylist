// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';

import React from 'react';
import { Container, Typography, Card, CardMedia, CardActions, CardActionArea, CardContent, Grid, Paper, Button, Link } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  card: {
    padding: theme.spacing(2),
    width: "auto",
    backgroundColor: "#f5f5f5",
    display: 'flex',
    flexDirection: 'column',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));


export default function DashboardSection() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent} >
                <Typography gutterBottom variant="h5" component="h2">
                  My List
                  </Typography>
                <Typography>
                  Update your song order
                  </Typography>
              </CardContent>
              <CardActions>
                <RouterLink to={"/Mylist" + window.location.search} style={{ textDecoration: 'none' }}>
                  <Button size="small" color="primary">
                    View
                  </Button>
                </RouterLink>
                <Button size="small" color="primary">
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Results
                </Typography>
                <Typography>
                  View the results
                </Typography>
              </CardContent>
              <CardActions>
                <RouterLink to={"/Results" + window.location.search} style={{ textDecoration: 'none' }}>
                  <Button size="small" color="primary">
                    View
                </Button>
                </RouterLink>
                <Button size="small" color="primary">
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
//   title: {
//     fontSize: 14,
//   },
//   pos: {
//     marginBottom: 12,
//   },
//   card: {
//     minWidth: 275,
//   },
// }));

// function SpacingGrid() {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Grid container justify="space-around">
//         <Grid container spacing={3}>
//           <Grid item xs>
//             <Link to={"/Mylist" + window.location.search}>
//             <Card className={classes.card}>
//               <CardContent>
//                 <Typography className={classes.pos} color="textSecondary">
//                   My List
//                 </Typography>
//                 <Typography variant="h5" component="h2">
//                   April
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small">Learn More</Button>
//               </CardActions>
//             </Card>
//             </Link>
//           </Grid>
//           <Grid item xs>
//             <Paper className={classes.paper}>Results</Paper>
//           </Grid>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }