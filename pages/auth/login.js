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
import { useAuthState } from "react-firebase-hooks/auth";
import { withPublic } from "../../hooks/auth";
import Cookies from "universal-cookie";
import Image from "next/image";
import { grey } from "@mui/material/colors";
function Login() {
  const router = useRouter();
  const [user, authLoading, authError] = useAuthState(auth);

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

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        setLoading(false);
        const token = await cred.user.getIdToken();
        const cookies = new Cookies();
        cookies.set("session", token, { path: "/" });
        // console.log("user logged in:", cred.user);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);

        if (err.message.match("auth/invalid-email")) {
          setError("Email tidak valid");
        } else if (err.message.match("auth/user-not-found")) {
          setError("Email tidak ditemukan");
        } else if (err.message.match("auth/wrong-password")) {
          setError("Password salah");
        } else {
          setError("Terjadi kesalahan");
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
    <Grid alignItems="center" container mt={8} pt={4}>
      <Box
        sx={{
          backgroundImage: 'url("/BG.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: {
            md: "50%",
            xs: 0,
          },
          zIndex: -1,
        }}
      ></Box>
      <Head>
        <title>Login</title>
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid xs={12} md={6} item sx={{ display: { md: "block", xs: "none" } }}>
        <Image width={69} height={93} src="/salib_white.png" />
        <Typography variant="h1" color="white" fontWeight={700}>
          BNKP
        </Typography>
        <Typography variant="h1" color="white" fontWeight={700}>
          EFRATA
        </Typography>
      </Grid>
      <Grid
        xs={12}
        mb={4}
        pl={4}
        item
        sx={{ display: { md: "none", xs: "flex" }, alignItems: "center" }}
      >
        <Image
          src="/emojione-monotone_church_white.png"
          width={25}
          height={25}
        />
        <Typography variant="h4" color="white" ml={2} fontWeight={700}>
          BNKP EFRATA
        </Typography>
      </Grid>
      <Grid
        xs={12}
        md={6}
        item
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Stack
          spacing={4}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "25rem",
            backgroundColor: "white",
            p: 4,
            borderRadius: "1rem",
          }}
        >
          <Stack>
            <Typography variant="h4" textAlign="start">
              Login
            </Typography>
            <Typography color={grey[500]} variant="subtitle2" textAlign="start">
              Selamat datang
            </Typography>
          </Stack>
          {error && (
            <Alert severity="error">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
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

          <Button
            disabled={loading ? true : false}
            variant="contained"
            type="submit"
            value="submit"
          >
            Masuk
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Login;
