import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase/ClientApp";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { getDownloadURL, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { onAuthStateChanged } from "firebase/auth";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  cursor: "pointer",
  padding: theme.spacing(2),
  textAlign: "start",
  border: "1px solid #e4e6e7",
  position: "relative",
  color: theme.palette.text.secondary,
  "&:hover": {
    borderColor: theme.palette.primary.dark,
  },
}));

export default function Jemaat() {
  const router = useRouter();
  // collection ref
  const colRef = collection(db, "jemaat_users");
  const [user, setUser] = useState();
  const [q, setQ] = useState(query(colRef));
  const [foto, setFoto] = useState();
  const [search, setSearch] = useState();
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    // realtime collection data
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setUser(data);
    });

    if (user) {
      user.forEach((e) => {
        if (e.foto) {
          getFoto(e.foto, e.id);
        }
      });
    }
  }, [user, q, search, notFound]);

  useEffect(()=> {
    onAuthStateChanged(auth, (user) => {
      if(!user){
        router.push('/auth/login')
      }
    })
  },[])



  const getFoto = async (path, key) => {
    const res = await getDownloadURL(ref(storage, path));
    setFoto((prev) => ({ ...prev, [key]: res }));
  };

  const handleSearch = (e) => {
    const key = e.target.value.toLowerCase();
    if (key) {
      const result = user.filter((i) => i.name.toLowerCase().indexOf(key) > -1);
      if (result.length != 0) {
        setSearch(result);
        setNotFound(false);
      } else {
        setSearch([]);
        console.log("notFound");
        setNotFound(true);
      }
    } else {
      setNotFound(false);
      setSearch(null);
      setQ(query(colRef));
    }
  };

  return (
    <div>
      <Head>
        <title>Data Jemaat</title>
      </Head>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <TextField
              onChange={handleSearch}
              id="input-with-icon-textfield"
              label="Cari nama user"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Grid>

        {user && foto && search == null ? (
          user.map((item) => (
            <Grid item xs={12} md={6} lg={3} key={item.id}>
                <Link href={`/jemaat/${item.id}`} passHref>
                <Item elevation={0}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        item.foto ? foto[item.id] : "blank-profile-picture.png"
                      }
                      sx={{ width: 48, height: 48, marginRight: "1rem" }}
                    />
                    <Box>
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="subtitle1">
                        Jemaat {item.status}
                      </Typography>
                    </Box>
                  </Stack>
                </Item>
            </Link>
              </Grid>
          ))
        ) : search && foto ? (
          search.map((item) => (
            <Grid
                item
                xs={12}
                md={6}
                lg={3}
                key={item.id}
              >
            <Link href={`/jemaat/${item.id}`} passHref>
                <Item elevation={0}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        item.foto ? foto[item.id] : "blank-profile-picture.png"
                      }
                      sx={{ width: 48, height: 48, marginRight: "1rem" }}
                    />
                    <Box>
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="subtitle1">
                        Jemaat {item.status}
                      </Typography>
                    </Box>
                  </Stack>
                </Item>
            </Link>
              </Grid>
          ))
        ) : (
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            item
            xs={12}
          >
            <CircularProgress />
          </Grid>
        )}

        {notFound && (
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            item
            xs={12}
          >
            Data tidak ditemukan
          </Grid>
        )}
      </Grid>
    </div>
  );
}


export async function getServerSideProps({req, res}){
  const sessionCookie = req.cookies.session || '';

  if(!sessionCookie){
    return{
      redirect:{
        destination: '/auth/login',
        permanent: false
      },
      props: {}
    }
  }
  return{
    props: {
      
    }
  }
}
