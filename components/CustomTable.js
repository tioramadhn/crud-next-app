import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useRouter } from 'next/router'


export default function CustomTable({data}) {
  const router = useRouter()
  const rows = data.data

  const handleDetail =(id) => {
    router.push(`detail?id=${id}`)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No. Stambuk</TableCell>
            <TableCell align="right">Nama</TableCell>
            <TableCell align="right">Aksi</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.nomorStambuk}
              </TableCell>
              <TableCell align="right">{row.nama}</TableCell>
              <TableCell align="right">
                <Button onClick={() => handleDetail(row._id)}  startIcon={<LaunchIcon/>} variant="contained">Detail</Button>                
              </TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
