import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Typography, Button, Grid } from '@mui/material'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import { useSelector } from 'react-redux'



const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

export default function 
() {






  const { accounts } = useSelector((state) => state.accountsManagement)

  console.log(accounts)











  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={12}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
            style={{backgroundColor: '#6699CC', fontWeight: 'bold'}}
            >
              
              <TableCell align="center"
              style={{backgroundColor: "#6699CC", minWidth: 'auto', fontWeight: 'bold',  display: 'inline-flex',}} 
              >
                      <CorporateFareIcon fontSize='medium' style={{marginTop: '5px', marginRight: '10px', color: 'white'}}/>
                      <Typography color='#fafafa' variant='h6'>
                          Accounts
                      </Typography>
            </TableCell>

            <TableCell align="center"
              style={{backgroundColor: "#6699CC", minWidth: 'auto', fontWeight: 'bold'}} 
              >
                      <Typography color='#fafafa' variant='h6'>
                          Type
                      </Typography>
            </TableCell>
            

            <TableCell align="center"
              style={{backgroundColor: "#6699CC", minWidth: 'auto', fontWeight: 'bold'}} 
              >
                      <Typography color='#fafafa' variant='h6'>
                          Manage Users
                      </Typography>
            </TableCell>

            <TableCell align="center"
              style={{backgroundColor: "#6699CC", minWidth: 'auto', fontWeight: 'bold'}} 
              >
                      <Typography color='#fafafa' variant='h6'>
                          Manage Providers
                      </Typography>
            </TableCell>

            <TableCell align="center"
              style={{backgroundColor: "#6699CC", minWidth: 'auto', fontWeight: 'bold'}} 
              >
                      <Typography color='#fafafa' variant='h6'>
                          Edit Account
                      </Typography>
            </TableCell>

            </TableRow>
          </TableHead>


          
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
