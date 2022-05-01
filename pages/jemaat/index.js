import {
  Avatar,
  Button,
  CircularProgress,
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
import { db, storage } from "../../firebase/ClientApp";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { getDownloadURL, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

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
  const [foto, setFoto] = useState()

  useEffect(() => {
    // realtime collection data
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setUser(data);
    });

    if(user){
      user.forEach(e=>{
        if(e.foto){
          getFoto(e.foto, e.id)
        }
      })
    }
  }, [user]);

  const handleDetail = (id) => {
    router.push(`/jemaat/${id}`);
  };

  const getFoto = async (path, key) => {
    const res = await getDownloadURL(ref(storage, path))
    setFoto(prev => ({...prev, [key]: res}))
  };

  return (
    <div>
      <Head>
        <title>Data Jemaat</title>
      </Head>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <TextField
              fullWidth
              id="input-with-icon-textfield"
              label="Cari user"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <Link href="/add" passHref>
              <Button variant="contained" startIcon={<AddIcon />}>
                Tambah
              </Button>
            </Link>
          </Stack>
        </Grid>

        {user && foto ? (
          user.map((item) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              key={item.id}
              onClick={() => handleDetail(item.id)}
            >
              <Item elevation={0}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    alt="Remy Sharp"
                    src={
                      item.foto
                        ? foto[item.id]
                        : "blank-profile-picture.png"
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
      </Grid>
    </div>
  );
}
