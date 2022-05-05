import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import GroupsIcon from "@mui/icons-material/Groups";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/ClientApp";
import { useState } from "react";
import Cookies from "universal-cookie";

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
    setOpen(false);
    setState({ success: false, loading: true, error: false });
    signOut(auth)
      .then(() => {
        const cookies = new Cookies();
        cookies.remove("session", { path: "/" });
        setState({ success: false, loading: false, error: false });
        router.replace('/auth/login')
      })
      .catch((err) => {
        console.log(err.message);
      });
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
        <ListItem button onClick={() => setOpen(true)}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Keluar"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, transition: "3s" }}>
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
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
