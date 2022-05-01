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
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/ClientApp";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";

export default function EditById({ id }) {
  const router = useRouter();
  let docRef = doc(db, "jemaat_users", id);
  const [user, setUser] = useState();
  const [foto, setFoto] = useState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    onSnapshot(docRef, (doc) => {
      setUser({ ...doc.data(), id: doc.id });
    });

    // if (user) {
    //   if (user.foto) {
    //     getDownloadURL(ref(storage, user.foto)).then((url) => {
    //       setFoto(url);
    //     });
    //   }else{
    //     setFoto('blank-profile-picture.png');
    //   }

    // }
  }, [user]);

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

  const uploadData = (data) => {
    setState((prev) => ({ ...prev, loading: true }));
    if (data.foto[0]) {
      const file = data.foto[0];
      const path = `efrata_photo/${Date.now()}-${data.name}-${file.name}`;
      data.foto = path;
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
        if(user.foto){
            data.foto = user.foto;
        }else{
            delete data.foto
        }
    }
    
    setDoc(docRef, {
        ...data,
        numStambuk: user.numStambuk
      })
      .then(() => {
        setState((prev) => ({ ...prev, loading: false, success: true }));
        console.log("berhasil ubah data");
        router.push("/jemaat/" + id);
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
        console.log(err.message);
      });
  };

  const handleClose = () => {
    setState({ success: false, loading: false, error: false });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Head>
        <title>Edit data</title>
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
          state.success ? "Data berhasil diubah" : "Data gagal diubah"
        }
        key={"top" + "center"}
      />
      {
        user ?  <Grid container justifyContent="center" spacing={2} sx={{ py: 4 }}>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography
              textAlign={"center"}
              variant="h4"
              component="span"
              sx={{ flexGrow: 1 }}
            >
              <EditIcon sx={{ marginRight: "1rem" }} />
              Edit data
            </Typography>

            <Divider />

            <TextField
              {...register("name", { required: "Nama perlu diisi" })}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name.message : null}
              label="Nama lengkap anda"
              variant="outlined"
              defaultValue={user.name}
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Jenis Kelamin
              </FormLabel>
              <RadioGroup row defaultValue={user.gender}>
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
              defaultValue={user.birthPlace}
              label="Tempat lahir"
              variant="outlined"
            />

            <TextField
              {...register("birthDate")}
              defaultValue={user.birthDate}
              id="date"
              label="Tanggal lahir"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              {...register("nik")}
              defaultValue={user.nik}
              label="NIK"
              variant="outlined"
              placeholder="ex: 1405020102011004"
            />

            <TextField
              {...register("registerAt")}
              defaultValue={user.registerAt}
              id="date"
              label="Tanggal registrasi"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              {...register("baptisAt")}
              defaultValue={user.baptisAt}
              id="date"
              label="Tanggal baptis"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              {...register("sidiAt")}
              defaultValue={user.sidiAt}
              id="date"
              label="Tanggal sidi"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              {...register("address")}
              defaultValue={user.address}
              label="Alamat"
              variant="outlined"
            />

            <TextField
              {...register("sector")}
              defaultValue={user.sector}
              label="Sektor"
              variant="outlined"
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Status Perkawinan
              </FormLabel>
              <RadioGroup row   defaultValue={user.isMarried} onChange={handleKawin}>
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
                defaultValue={user.marriedAt}
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
              <RadioGroup row  defaultValue={user.status} onChange={handleStatus}>
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
                defaultValue={user.deadAt}
                id="date"
                label="Tanggal meninggal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {value?.status == "Pindah"  && (
              <TextField
                {...register("moveAt")}
                defaultValue={user.moveAt}
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
              Ubah data
            </Button>
          </Stack>
        </Grid>
      </Grid> :
      <Grid container justifyContent="center" p={4}>
       <CircularProgress />
      </Grid>
      }
     
    </LocalizationProvider>
  );
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  return {
    props: { id }, // will be passed to the page component as props
  };
}
