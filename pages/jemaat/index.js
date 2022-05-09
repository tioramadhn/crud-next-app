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
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase/ClientApp";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { getDownloadURL, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { onAuthStateChanged } from "firebase/auth";
import FilterListIcon from "@mui/icons-material/FilterList";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { getAge } from "../../utils/date";
import { jsPDF } from "jspdf";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { red } from "@mui/material/colors";

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

export default function Jemaat({ data }) {
  const router = useRouter();

  const [user, setUser] = useState(data);
  const [foto, setFoto] = useState([]);

  const [search, setSearch] = useState();
  const [notFound, setNotFound] = useState(false);

  const [key, setKey] = useState();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    kategori: "all",
  });

  useEffect(() => {
    if (key || filter.kategori != "all") {
      let result = [];

      if (key) {
        result = user.filter((i) => i.name.toLowerCase().indexOf(key) > -1);
      }

      if (filter.kategori == "anak") {
        result = user.filter((i) => getAge(i.birthDate) <= 12);
        if (key) {
          result = result.filter((i) => i.name.toLowerCase().indexOf(key) > -1);
        }
      }

      if (filter.kategori == "remaja") {
        result = user.filter(
          (i) => getAge(i.birthDate) > 12 && getAge(i.birthDate) <= 18
        );
        if (key) {
          result = result.filter((i) => i.name.toLowerCase().indexOf(key) > -1);
        }
      }

      if (filter.kategori == "dewasa") {
        result = user.filter(
          (i) => getAge(i.birthDate) > 18 && getAge(i.birthDate) <= 60
        );
        if (key) {
          result = result.filter((i) => i.name.toLowerCase().indexOf(key) > -1);
        }
      }

      if (filter.kategori == "lansia") {
        result = user.filter((i) => getAge(i.birthDate) > 60);
        if (key) {
          result = result.filter((i) => i.name.toLowerCase().indexOf(key) > -1);
        }
      }

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
    }
    // console.log(filter);
  }, [search, notFound, key, filter]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login");
      }
    });

    if (user) {
      user.forEach(async (e) => {
        if (e.foto) {
          const res = await getDownloadURL(ref(storage, e.foto));
          setFoto((prev) => ({ ...prev, [e.id]: res }));
        }
      });
    }

    // console.log(user, foto);
  }, []);

  const handleSearch = (e) => {
    const key = e.target.value.toLowerCase();
    setKey(key);
  };

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("BNKP EFRATA", 20, 20);
    
    doc.setFontSize(16);
    doc.text("Berikut adalah daftar jemaat", 20, 30);

    var generateData = function(amount) {
      var result = [];
      var data = {
        coin: "100",
        game_group: "GameGroup",
        game_name: "XPTO2",
        game_version: "25",
        machine: "20485861",
        vlt: "0"
      };
      for (var i = 0; i < amount; i += 1) {
        data.id = (i + 1).toString();
        result.push(Object.assign({}, data));
      }
      // console.log(result)
      return result;
    };
    
    function createHeaders(keys) {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 65,
          align: "center",
          padding: 0
        });
      }
      return result;
    }
    
    var headers = createHeaders([
      "id",
      "coin",
      "game_group",
      "game_name",
      "game_version",
      "machine",
      "vlt"
    ]);

    doc.table(20,40, generateData(100), headers, { autoSize: true });

    doc.save("efrata_jemaat.pdf")
  }

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
          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
            <Button
              sx={{ width: "max-content", height: "max-content" }}
              onClick={() => setOpen(!open)}
              endIcon={<FilterListIcon />}
              variant="contained"
            >
              Filter By
            </Button>

            <Button
              sx={{ width: "max-content", height: "max-content" }}
              onClick={() => handlePdf()}
              endIcon={<PictureAsPdfIcon />}
              variant="outlined"
            >
              Unduh PDF
            </Button>
            </Stack>
           

            {open && (
              <FormControl>
                <RadioGroup
                  row
                  onChange={(e) => {
                    setFilter({ [e.target.name]: e.target.value });
                  }}
                  defaultValue={filter.kategori ?? ""}
                  name="kategori"
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="Semua"
                  />
                  <FormControlLabel
                    value="anak"
                    control={<Radio />}
                    label="Anak-anak"
                  />
                  <FormControlLabel
                    value="remaja"
                    control={<Radio />}
                    label="Remaja"
                  />
                  <FormControlLabel
                    value="dewasa"
                    control={<Radio />}
                    label="Dewasa"
                  />
                  <FormControlLabel
                    value="lansia"
                    control={<Radio />}
                    label="Lansia"
                  />
                </RadioGroup>
              </FormControl>
            )}
          </Stack>
        </Grid>

        {user && search == null ? (
          user.map((item) => (
            <Grid item xs={12} md={6} lg={3} key={item.id}>
              <Link href={`/jemaat/${item.id}`} passHref>
                <Item elevation={0}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {foto[item.id] ? (
                      <Avatar
                        alt="Remy Sharp"
                        src={foto[item.id]}
                        sx={{ width: 48, height: 48, marginRight: "1rem" }}
                      />
                    ) : (
                      <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 48, height: 48, marginRight: "1rem" }}
                      />
                    )}

                    <Box>
                      <Typography variant="subtitle2">
                        {item.name.length > 15
                          ? `${item.name.substring(0, 15)}...`
                          : item.name}
                      </Typography>
                      <Typography variant="subtitle1">
                        Jemaat {item.status}
                      </Typography>
                    </Box>
                  </Stack>
                </Item>
              </Link>
            </Grid>
          ))
        ) : search ? (
          search.map((item) => (
            <Grid item xs={12} md={6} lg={3} key={item.id}>
              <Link href={`/jemaat/${item.id}`} passHref>
                <Item elevation={0}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {foto[item.id] ? (
                      <Avatar
                        alt="Remy Sharp"
                        src={foto[item.id]}
                        sx={{ width: 48, height: 48, marginRight: "1rem" }}
                      />
                    ) : (
                      <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 48, height: 48, marginRight: "1rem" }}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle2">
                        {item.name.length > 15
                          ? `${item.name.substring(0, 15)}...`
                          : item.name}
                      </Typography>
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

  // collection ref
  const colRef = collection(db, "jemaat_users");

  let data = [];
  let dataFoto = [];
  const querySnapshot = await getDocs(colRef);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push({ ...doc.data(), id: doc.id });
  });

  return {
    props: { data },
  };
}
