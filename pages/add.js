import {
  Avatar,
  Button,
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

export default function Add() {
  const router = useRouter();
  const [date, setDate] = useState(null);
  const [aktif, setAktif] = useState("");
  const [nikah, setNikah] = useState("");
  const [isFill, setIsFill] = useState(false);
  const [preview, setPreview] = useState(null);
  const [lastUser, setLastUser] = useState(null);
  const collRef = collection(db, "jemaat_users");

  const [data, setData] = useState({
    num_stambuk: 0,
    foto: "",
    name: "",
    address: "",
    nik: "",
    place_birth: "",
    date_birth: "",
    gender: "Perempuan",
    register_at: "",
    baptis_at: "",
    sidi_at: "",
    sector: "",
    status: "Aktif",
    married_at: "",
    is_married: "Belum Kawin",
    move_at: "",
    passed_away_at: "",
  });

  useEffect(() => {
    const endUser = {};
    const q = query(collRef, orderBy("num_stambuk", "desc"), limit(1));
    const getData = async () => {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        endUser = doc.data();
        setData((prev) => ({ ...prev, num_stambuk: endUser.num_stambuk + 1 }));
      });
    };
    getData()
    // console.log(data);
  }, [data]);


  const handleChange = (newValue, key) => {
    if (newValue) {
      setDate((prev) => ({ ...prev, [key]: newValue }));
      const date = Timestamp.fromDate(newValue._d).seconds;
      setData((prev) => ({ ...prev, [key]: date }));
      // console.log(data);
    }
  };

  const handleData = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [key]: value }));
    // console.log(data);

    if (data.name) {
      setIsFill(true);
    } else {
      setIsFill(false);
    }
  };

  const handleFile = (e) => {
    const key = e.target.name;
    const value = e.target.files[0];
    console.log('halooo')
    setPreview(URL.createObjectURL(value))
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (data.foto) {
      const file = data.foto;
      const storageRef = ref(storage, "user_photo/" + file.name);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Foto sukses di upload");
        })
        .catch((err) => console.log(err.message));
      setData((prev) => ({ ...prev, foto: "user_photo/" + file.name }));
    }

    const docRef = await addDoc(collRef, data);
    if (docRef.id) {
      router.push("/");
    }
    console.log("Document written with ID: ", docRef.id);
  };

  const Input = styled("input")({
    display: "none",
  });

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Head>
        <title>Tambah data</title>
      </Head>
      <Grid container justifyContent="flex-start" spacing={2} sx={{ p: 4 }}>
        <Grid item xs={12} md={7} justifyItems="flex-end">
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Box position="relative">
              <Avatar
                alt="profile picture"
                src={preview ? preview : "/no_profile.png"}
                sx={{ width: 400, height: 400 }}
              />
              <Box position="absolute" right={40} bottom={0}>
                <label htmlFor="icon-button-file">
                  <Input
                    name="foto"
                    onChange={handleFile}
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                  />
                  <IconButton
                    sx={{
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#eaeaea",
                        border: "2px solid white",
                        boxSizing: "border-box",
                      },
                    }}
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera sx={{ fontSize: 60 }} />
                  </IconButton>
                </label>
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Stack spacing={2}>
            <TextField
              id="standard-basic"
              label="Nama lengkap anda"
              name="name"
              variant="outlined"
              required
              // error
              // helperText="Wajib diisi"
              onKeyUp={handleData}
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Jenis Kelamin
              </FormLabel>
              <RadioGroup
                row
                name="gender"
                onChange={handleData}
                defaultValue="Perempuan"
              >
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
              required
              id="standard-basic"
              label="Tempat lahir"
              name="place_birth"
              variant="outlined"
              onChange={handleData}
            />

            <DesktopDatePicker
              required
              label="Tanggal Lahir"
              value={date?.date_birth}
              name="date_birth"
              inputFormat="DD/MM/yyyy"
              onChange={(e) => handleChange(e, "date_birth")}
              renderInput={(params) => <TextField {...params} />}
            />

            <TextField
              required
              id="standard-basic"
              label="NIK"
              name="nik"
              variant="outlined"
              onChange={handleData}
            />

            <DesktopDatePicker
              required
              value={date?.register_at}
              label="Tanggal Mendaftar"
              inputFormat="DD/MM/yyyy"
              name="register_at"
              onChange={(e) => handleChange(e, "register_at")}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              value={date?.baptis_at}
              label="Tanggal Baptis"
              inputFormat="DD/MM/yyyy"
              name="baptis_at"
              onChange={(e) => handleChange(e, "baptis_at")}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              value={date?.sidi_at}
              label="Tanggal Sidi"
              inputFormat="DD/MM/yyyy"
              name="sidi_at"
              onChange={(e) => handleChange(e, "sidi_at")}
              renderInput={(params) => <TextField {...params} />}
            />

            <TextField
              required
              id="standard-basic"
              label="Alamat"
              name="address"
              variant="outlined"
              onChange={handleData}
            />

            <TextField
              required
              id="standard-basic"
              label="Sektor"
              name="sector"
              variant="outlined"
              onChange={handleData}
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Perkawinan
              </FormLabel>
              <RadioGroup
                row
                name="is_married"
                defaultValue="Belum Kawin"
                onChange={handleData}
              >
                <FormControlLabel
                  onClick={() => setNikah("Kawin")}
                  value="Kawin"
                  control={<Radio />}
                  label="Kawin"
                />
                <FormControlLabel
                  onClick={() => setNikah("Belum Kawin")}
                  value="Belum Kawin"
                  control={<Radio />}
                  label="Belum Kawin"
                />
              </RadioGroup>
            </FormControl>

            {nikah == "Kawin" && (
              <DesktopDatePicker
                label="Tanggal Nikah"
                inputFormat="DD/MM/yyyy"
                name="married_at"
                onChange={(e) => handleChange(e, "married_at")}
                renderInput={(params) => <TextField {...params} />}
              />
            )}

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Keaktifan
              </FormLabel>
              <RadioGroup
                row
                name="status"
                defaultValue="Aktif"
                onChange={handleData}
              >
                <FormControlLabel
                  onClick={() => setAktif("Aktif")}
                  value="Aktif"
                  control={<Radio />}
                  label="Aktif"
                />
                <FormControlLabel
                  onClick={() => setAktif("Pindah")}
                  value="Pindah"
                  control={<Radio />}
                  label="Pindah"
                />
                <FormControlLabel
                  onClick={() => setAktif("Meninggal")}
                  value="Meninggal"
                  control={<Radio />}
                  label="Meninggal"
                />
              </RadioGroup>
            </FormControl>

            {aktif == "Meninggal" && (
              <DesktopDatePicker
                value={date?.passed_away_at}
                label="Tanggal Meninggal"
                inputFormat="DD/MM/yyyy"
                name="passed_away_at"
                onChange={(e) => handleChange(e, "passed_away_at")}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            {aktif == "Pindah" && (
              <DesktopDatePicker
                value={date?.move_at}
                label="Tanggal Pindah"
                inputFormat="DD/MM/yyyy"
                name="move_at"
                onChange={(e) => handleChange(e, "move_at")}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isFill ? false : true}
            >
              Tambah data
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
