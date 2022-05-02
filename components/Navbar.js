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

export default function ButtonAppBar() {
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
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            <Button color="inherit">Login</Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
