import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from "next/router";
import GroupsIcon from '@mui/icons-material/Groups';
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import {
 signOut,
} from 'firebase/auth'
import { auth } from "../firebase/ClientApp";

export default function ButtonAppBar({user}) {
  const router = useRouter()

  const [drawer, setDrawer] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer(open);
  };

  const handleLogOut = ( ) => {
    signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
  }

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>

        <Link href={'/'} passHref>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Beranda"} />
        </ListItem>
        </Link>

        <Link href={'/jemaat'} passHref>
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

        <Divider/>
        <ListItem button  onClick={handleLogOut}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Keluar"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, transition: '3s' }}>
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
            {user &&   <Typography variant="h6" component="div">
              Hi, {user.email}
            </Typography>}
          
            
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
