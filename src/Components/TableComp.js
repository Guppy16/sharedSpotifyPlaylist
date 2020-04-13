import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: "90vw",
  },
});

export default function SimpleTable(props) {
  const classes = useStyles();
  const rows = props.rows;
  const headers = props.head;
  console.log("Getting table");
  console.log(headers);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{headers[0]}</TableCell>
            {
                headers.map( (value, index) => {
                    if (index !== 0){
                        return <TableCell align="right">{value} &nbsp;</TableCell>
                    }
                })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              <TableCell component="th" scope="row">
                {row.values[0]}
              </TableCell>
              {
                  row.values.map( (value, index) => {
                      if (index !== 0){
                        return <TableCell align="right">{value}</TableCell>
                      }
                  })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
