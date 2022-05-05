import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  MuiAlert,
  Snackbar,
} from "@mui/material";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useForm } from "react-hook-form";
import { ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase/ClientApp";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function Add() {
  const router = useRouter();
  const colRef = collection(db, "jemaat_users");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    if (data.isMarried == "Belum Kawin") {
      delete data.marriedAt;
    }
    if (data.status == "Aktif") {
      delete data.moveAt;
      delete data.deadAt;
    } else if (data.status == "Pindah") {
      delete data.deadAt;
    } else {
      delete data.moveAt;
    }
    uploadData(data);
  };
  const [value, setValue] = useState();
  const [state, setState] = useState({
    loading: false,
    success: false,
    error: false,
  });

  const handleKawin = (e) => {
    setValue((prev) => ({ ...prev, kawin: e.target.value }));
  };
  const handleStatus = (e) => {
    setValue((prev) => ({ ...prev, status: e.target.value }));
  };

  const uploadData = (user) => {
    setState((prev) => ({ ...prev, loading: true }));
    if (user.foto[0]) {
      const file = user.foto[0];
      const path = `efrata_photo/${Date.now()}-${user.name}-${file.name}`;
      user.foto = path;
      const storageRef = ref(storage, path);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Foto sukses di upload");
        })
        .catch((err) => {
          setState((prev) => ({ ...prev, loading: false, error: true }));
          console.log(err.message);
        });
    } else {
      delete user.foto;
    }
    addDoc(colRef, {
      ...user,
      numStambuk: `0924${Date.now()}`,
    })
      .then(() => {
        reset({
          name: "",
          birthPlace: "",
          birthDate: "",
          nik: "",
          registerAt: "",
          baptisAt: "",
          sidiAt: "",
          address: "",
          sector: "",
          foto: "",
          marriedAt: "",
          moveAt: "",
          deadAt: "",
        });
        setState((prev) => ({ ...prev, loading: false, success: true }));
        console.log("berhasil tambahin data");
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
        console.log(err.message);
      });
  };

  const handleClose = () => {
    setState({ success: false, loading: false, error: false });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login");
      }
    });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Head>
        <title>Tambah data</title>
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state.error || state.success}
        onClose={handleClose}
        message={
          state.success ? "Data berhasil ditambahkan" : "Data gagal ditambahkan"
        }
        key={"top" + "center"}
      />
      <Grid container justifyContent="center" spacing={2} sx={{ py: 4 }}>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("name", { required: "Nama perlu diisi" })}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name.message : null}
              label="Nama lengkap anda"
              variant="outlined"
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Jenis Kelamin
              </FormLabel>
              <RadioGroup row defaultValue="Perempuan">
                <FormControlLabel
                  {...register("gender")}
                  value="Perempuan"
                  control={<Radio />}
                  label="Perempuan"
                />
                <FormControlLabel
                  {...register("gender")}
                  value="Laki-laki"
                  control={<Radio />}
                  label="Laki-Laki"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              {...register("birthPlace")}
              label="Tempat lahir"
              variant="outlined"
            />

            <TextField
              {...register("birthDate")}
              id="date"
              label="Tanggal lahir"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              {...register("nik")}
              label="NIK"
              variant="outlined"
              placeholder="ex: 1405020102011004"
            />

            <TextField
              {...register("fatherName")}
              label="Nama Ayah"
              variant="outlined"
            />

            <TextField
              {...register("motherName")}
              label="Nama Ibu"
              variant="outlined"
            />

            <TextField
              {...register("registerAt")}
              id="date"
              label="Tanggal registrasi"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              {...register("baptisAt")}
              id="date"
              label="Tanggal baptis"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              {...register("sidiAt")}
              id="date"
              label="Tanggal sidi"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              {...register("address")}
              label="Alamat"
              variant="outlined"
            />

            <TextField
              {...register("sector")}
              label="Sektor"
              variant="outlined"
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Perkawinan
              </FormLabel>
              <RadioGroup row defaultValue="Belum Kawin" onChange={handleKawin}>
                <FormControlLabel
                  {...register("isMarried")}
                  value="Kawin"
                  control={<Radio />}
                  label="Kawin"
                />
                <FormControlLabel
                  {...register("isMarried")}
                  value="Belum Kawin"
                  control={<Radio />}
                  label="Belum Kawin"
                />
              </RadioGroup>
            </FormControl>

            {value?.kawin == "Kawin" && (
              <TextField
                {...register("marriedAt")}
                id="date"
                label="Tanggal menikah"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Keaktifan
              </FormLabel>
              <RadioGroup row defaultValue="Aktif" onChange={handleStatus}>
                <FormControlLabel
                  {...register("status")}
                  value="Aktif"
                  control={<Radio />}
                  label="Aktif"
                />
                <FormControlLabel
                  {...register("status")}
                  value="Pindah"
                  control={<Radio />}
                  label="Pindah"
                />
                <FormControlLabel
                  {...register("status")}
                  value="Meninggal"
                  control={<Radio />}
                  label="Meninggal"
                />
              </RadioGroup>
            </FormControl>

            {value?.status == "Meninggal" && (
              <TextField
                {...register("deadAt")}
                id="date"
                label="Tanggal meninggal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {value?.status == "Pindah" && (
              <TextField
                {...register("moveAt")}
                id="date"
                label="Tanggal pindah"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}

            <TextField
              accept="image/*"
              {...register("foto", { max: 1 })}
              error={errors.foto ? true : false}
              helperText={errors.foto ? "max 1 foto" : null}
              label="Upload foto"
              type="file"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={state.loading ? true : false}
            >
              Tambah data
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}

export async function getServerSideProps({ req, res }) {
  const sessionCookie = req.cookies.session || "";

  if (!sessionCookie) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
      props: {},
    };
  }
  return{
    props: {
      
    }
  }
}
