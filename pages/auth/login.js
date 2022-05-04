import HttpsIcon from "@mui/icons-material/Https";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/ClientApp";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    setLoading(true)
    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        setLoading(false)
        // console.log("user logged in:", cred.user);
      })
      .catch((err) => {
        setLoading(false)
        console.log(err.message);

        if(err.message.match("auth/invalid-email")){
          setError("Email tidak valid")
        }else if(err.message.match("auth/user-not-found")){
          setError("Email tidak ditemukan")
        }else if(err.message.match("auth/wrong-password")){
          setError("Password salah")
        }else{
          setError("Terjadi kesalahan")
        }

      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  return (
    <Grid
      justifyContent={"center"}
      alignItems="center"
      container
      sx={{ height: "100vh" }}
    >
      <Box
        sx={{
          backgroundImage: 'url("/wave.svg")',
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      ></Box>
      <Head>
        <title>Login</title>
      </Head>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid xs={12} md={4} item>
        <Stack
          spacing={4}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            backgroundColor: "white",
            border: "1px solid #e4e6e7",
            p: 4,
            borderRadius: "1rem",
          }}
        >
          <Typography variant="h4" textAlign="center">
            Login
          </Typography>

         {error && <Alert severity="error">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
          }
          <TextField
            {...register("email", { required: "Email wajib di isi" })}
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            id="input-with-icon-textfield"
            label="Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          <TextField
            {...register("password", { required: "Password wajib di isi" })}
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : null}
            id="input-with-icon-textfield"
            label="Password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HttpsIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="standard"
          />

          <Button disabled={loading? true : false} variant="contained" type="submit" value="submit">
            Masuk
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
