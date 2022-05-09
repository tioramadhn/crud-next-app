import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  Backdrop,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  OutlinedInput,
  Snackbar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import GroupsIcon from "@mui/icons-material/Groups";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../firebase/ClientApp";
import { useState } from "react";
import Cookies from "universal-cookie";
import { collection, getDocs } from "firebase/firestore";
import csvDownload from "json-to-csv-export";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockResetIcon from '@mui/icons-material/LockReset';

export default function ButtonAppBar({ user }) {
  const router = useRouter();
  const [state, setState] = useState({
    loading: false,
    success: false,
    error: false,
  });
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setState({ success: false, loading: false, error: false });
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer(open);
  };

  const handleLogOut = () => {
    setState({ success: false, loading: true, error: false });
    setOpen(false);
    signOut(auth)
      .then(() => {
        fetch('/api/auth/logout', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        })
        router.replace("/auth/login");
      })
      .catch((err) => {
        console.log(err.message);
      });
    setState({ success: false, loading: false, error: false });
  };

  const handleExport = async () => {
    setState({ success: false, loading: true, error: false });
    let data = [];
    const querySnapshot = await getDocs(collection(db, "jemaat_users"));
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setState({ success: false, loading: false, error: false });
    csvDownload(data);
  };

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <Link href={"/"} passHref>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Beranda"} />
          </ListItem>
        </Link>

        <Link href={"/jemaat"} passHref>
          <ListItem button>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary={"Data Jemaat"} />
          </ListItem>
        </Link>

        <Link href="/add" passHref>
          <ListItem button>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Tambah data"} />
          </ListItem>
        </Link>

        <Divider />
        <ListItem button onClick={() => setOpenModal(true)}>
          <ListItemIcon>
            <LockResetIcon />
          </ListItemIcon>
          <ListItemText primary={"Ubah password"} />
        </ListItem>

        <Divider />
        <ListItem button onClick={handleExport}>
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText primary={"Export CSV"} />
        </ListItem>

        <Divider />
        <ListItem button onClick={() => setOpen(true)}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Keluar"} />
        </ListItem>
      </List>
    </Box>
  );
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const [password, setPassword] = useState({
    valueLama: "",
    showLama: false,
    valueBaru: "",
    showBaru: false,
  });

  const handleClickShowPasswordLama = () => {
    setPassword({
      ...password,
      showLama: !password.showLama,
    });
  };

 
  const handleClickShowPasswordBaru = () => {
    setPassword({
      ...password,
      showBaru: !password.showBaru,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setPassword({ ...password, [prop]: event.target.value });
  };

  const handleUbahPassword = async () => {
    setState({ success: false, loading: true, error: null });
    const user = auth.currentUser;
    console.log(password.valueLama, password.valueBaru);
    const credential = EmailAuthProvider.credential(
      user.email,
      password.valueLama
    );

    if (password.valueLama && password.valueBaru ) {
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated.
          updatePassword(user, password.valueBaru)
            .then(() => {
              setState({ success: true, loading: false, error: null });
              console.log("success change password");
              setOpenModal(false);
            })
            .catch((error) => {
              setState({
                success: false,
                loading: false,
                error: "Password minimal 6 karakter",
              });
              console.log(error.message);
            });
        })
        .catch((error) => {
          console.log("gagal auth");
          setState({
            success: false,
            loading: false,
            error: "Password lama salah",
          });
        });
    } else {
      console.log('kosong')
      setState({
        success: false,
        loading: false,
        error: "Tidak ada data yang dimasukkan",
      });
    }

  };
  return (
    <Box sx={{ flexGrow: 1, transition: "3s" }}>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state.success}
        onClose={handleClose}
        message={state.success ? "Password berhasil di ubah" : null}
        key={"top" + "center"}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Ubah password
          </Typography>

          {state.error && <Alert severity="error">{state.error}</Alert>}

        <FormControl sx={{ mt: 2, width: '100%' }} variant="standard">
          <InputLabel htmlFor="password-lama">Password lama</InputLabel>
          <Input
            id="password-lama"
            type={password.showLama ? 'text' : 'password'}
            value={password.valueLama}
            onChange={handleChange('valueLama')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordLama}
                  onMouseDown={handleMouseDownPassword}
                >
                  {password.showLama? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl sx={{ my: 2, width: '100%' }} variant="standard">
          <InputLabel htmlFor="password-baru">Password baru</InputLabel>
          <Input
            id="password-baru"
            type={password.showBaru ? 'text' : 'password'}
            value={password.password}
            onChange={handleChange('valueBaru')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordBaru}
                  onMouseDown={handleMouseDownPassword}
                >
                  {password.showBaru ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

          <Button sx={{ float: "right" }} disabled={state.loading} onClick={handleUbahPassword}>
            Simpan
          </Button>
        </Box>
      </Modal>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Apakah anda yakin ingin keluar ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Klik lanjut untuk keluar
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>batal</Button>
          <Button onClick={handleLogOut} autoFocus>
            lanjut
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Drawer anchor={"left"} open={drawer} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
      <AppBar position="static" color="secondary">
        <Container>
          <Toolbar>
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              BNKP EFRATA
            </Typography>
            <Typography variant="h6" component="div">
              Hi, Admin
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
