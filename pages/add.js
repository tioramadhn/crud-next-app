import {
  Avatar,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { PhotoCamera } from "@mui/icons-material";
import { Box } from "@mui/system";
import {
  Timestamp,
  collection,
  orderBy,
  limit,
  query,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/ClientApp";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase/ClientApp";
import { useRouter } from "next/router";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Add() {
  const [data, setData] = useState()
  const [date, setDate] = useState()
  const [input, setInput] = useState()

  useEffect(()=> {
    if(data?.isMarried == 'Kawin'){
      setInput(prev => (
        {...prev,
           dateMarried: data.isMarried
        }))
    }else{
      delete data?.marriedAt
    }

    if(data?.status){
      setInput(prev => (
        {...prev,
           dateStatus: data.status
        }))
    }
    
    if(data?.status == 'Aktif'){
      delete data?.moveAt
      delete data?.deadAt
    }else if(data?.status == 'Pindah'){
      delete data?.deadAt
    }else if(data?.status == 'Meninggal'){
      delete data?.moveAt
    }

    console.log(data)
  }, [data, date])

  function handleInputChange(event, dateField=null) {
    if(event.target){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      setData(prev => ({...prev, [name]: value}));
    }else{
      setData(prev => ({...prev, [dateField]: Timestamp.fromDate(event.toDate()).seconds}));
      setDate(prev => ({...prev, [dateField]: event.toDate()}))
    }
   
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Head>
        <title>Tambah data</title>
      </Head>
      <Grid container justifyContent="center" spacing={2} sx={{ p: 4 }}>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} component="form"  onSubmit={handleSubmit}>
            <Typography
              textAlign={"center"}
              variant="h4"
              component="span"
              sx={{ flexGrow: 1 }}
            >
              <PersonAddIcon sx={{ marginRight: "1rem" }} />
              Tambah data
            </Typography>

            <Divider />

            <TextField
              onChange={(e) => handleInputChange(e)}
              label="Nama lengkap anda"
              name="name"
              variant="outlined"
              required
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Jenis Kelamin
              </FormLabel>
              <RadioGroup row name="gender" defaultValue="Perempuan"  onChange={(e) => handleInputChange(e)}>
                <FormControlLabel
                  value="Perempuan"
                  control={<Radio />}
                  label="Perempuan"
                />
                <FormControlLabel
                  value="Laki-laki"
                  control={<Radio />}
                  label="Laki-Laki"
                />
              </RadioGroup>
            </FormControl>

            <TextField
             onChange={(e) => handleInputChange(e)}
              required
              label="Tempat lahir"
              name="birthPlace"
              variant="outlined"
            />

            <DesktopDatePicker
            onChange={(e) => handleInputChange(e, 'birthDate')}
            value={date?.birthDate}
              label="Tanggal Lahir"
              name="birthDate"
              inputFormat="DD/MM/yyyy"
              renderInput={(params) => <TextField {...params} />}
            />

            <TextField
             onChange={(e) => handleInputChange(e)}
              required
              label="NIK"
              name="nik"
              variant="outlined"
            />

            <DesktopDatePicker
            onChange={(e) => handleInputChange(e, 'registerAt')}
            value={date?.registerAt}
              label="Tanggal Mendaftar"
              inputFormat="DD/MM/yyyy"
              name="registerAt"
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
             onChange={(e) => handleInputChange(e, 'baptisAt')}
             value={date?.baptisAt}
              label="Tanggal Baptis"
              inputFormat="DD/MM/yyyy"
              name="baptisAt"
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
             onChange={(e) => handleInputChange(e, 'sidiAt')}
             value={date?.sidiAt}
              label="Tanggal Sidi"
              inputFormat="DD/MM/yyyy"
              name="sidiAt"
              renderInput={(params) => <TextField {...params} />}
            />

            <TextField
             onChange={(e) => handleInputChange(e)}
              required
              label="Alamat"
              name="address"
              variant="outlined"
            />

            <TextField
             onChange={(e) => handleInputChange(e)}
              required
              label="Sektor"
              name="sector"
              variant="outlined"
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Perkawinan
              </FormLabel>
              <RadioGroup row name="isMarried" defaultValue="Belum Kawin" onChange={(e) => handleInputChange(e)}>
                <FormControlLabel
                  value="Kawin"
                  control={<Radio />}
                  label="Kawin"
                />
                <FormControlLabel
                  value="Belum Kawin"
                  control={<Radio />}
                  label="Belum Kawin"
                />
              </RadioGroup>
            </FormControl>

            {input?.dateMarried == 'Kawin' && (
              <DesktopDatePicker
              onChange={(e) => handleInputChange(e, 'marriedAt')}
              value={date?.marriedAt}
                label="Tanggal Nikah"
                inputFormat="DD/MM/yyyy"
                name="marriedAt"
                renderInput={(params) => <TextField {...params} />}
              />
            )}

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Keaktifan
              </FormLabel>
              <RadioGroup row name="status" defaultValue="Aktif" onChange={(e) => handleInputChange(e)}>
                <FormControlLabel
                  value="Aktif"
                  control={<Radio />}
                  label="Aktif"
                />
                <FormControlLabel
                  value="Pindah"
                  control={<Radio />}
                  label="Pindah"
                />
                <FormControlLabel
                  value="Meninggal"
                  control={<Radio />}
                  label="Meninggal"
                />
              </RadioGroup>
            </FormControl>

            {input?.dateStatus == 'Meninggal' && (
              <DesktopDatePicker
              onChange={(e) => handleInputChange(e, 'deadAt')}
              value={date?.deadAt}
                label="Tanggal Meninggal"
                inputFormat="DD/MM/yyyy"
                name="deadAt"
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            {input?.dateStatus == 'Pindah'  && (
              <DesktopDatePicker
              onChange={(e) => handleInputChange(e, 'moveAt')}
              value={date?.moveAt}
                label="Tanggal Pindah"
                inputFormat="DD/MM/yyyy"
                name="moveAt"
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            <Button
              type="submit"
              variant="contained"
            >
              Tambah data
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
