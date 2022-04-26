import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable({ rows }) {
  const router = useRouter();

  // const [name, nik, numStambuk, placeBirth, sector, address, dateBirth, isActive, isMarried, foto] = data

  const handleEdit = (e) => {
    e.preventDefault();
    router.push("/edit");
  };

  const handleDelete = (e) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell align="right">No. Stambuk</TableCell>
            <TableCell align="right">Sektor</TableCell>
            <TableCell align="right">Alamat</TableCell>
            <TableCell align="right">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ name, num_stambuk, sector, address }) => (
            <TableRow
              key={num_stambuk}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">{num_stambuk}</TableCell>
              <TableCell align="right">{sector}</TableCell>
              <TableCell align="right">{address}</TableCell>
              <TableCell align="right">
                <IconButton onClick={handleEdit} aria-label="edit" size="small">
                  <EditIcon fontSize="inherit" />
                </IconButton>{" "}
                |
                <IconButton aria-label="delete" size="small">
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
