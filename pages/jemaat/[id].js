import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase/ClientApp";
import {
  Avatar,
  Backdrop,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import CircularProgress from "@mui/material/CircularProgress";
import { getDownloadURL, ref } from "firebase/storage";
import { dateFormatter, getAge } from "../../utils/date";
import Head from "next/head";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Detail = ({ id }) => {
  const router = useRouter();
  const docRef = doc(db, "jemaat_users", id);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState();
  const [state, setState] = useState({
    loading: false,
    success: false,
    error: false,
  });
  useEffect(() => {
    onSnapshot(docRef, (doc) => {
      setUser({ ...doc.data(), id: doc.id });
    });

    if (user) {
      if (user.foto) {
        getDownloadURL(ref(storage, user.foto)).then((url) => {
          setFoto(url);
        });
      }else{
        setFoto('blank-profile-picture.png');
      }
    }
  }, [user]);

  const handleDelete = (id) => {
    setState((prev) => ({ ...prev, loading: true }));
    const docRef = doc(db, "jemaat_users", id);
    deleteDoc(docRef)
      .then(() => {
        setState((prev) => ({ ...prev, loading: false, success: true }));
        router.push("/jemaat");
      })
      .catch(() => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
      });
  };

  const handleClose = () => {
    setState({ success: false, loading: false, error: false });
  };
  return (
    <div>
      <Head>
        <title>Detail jemaat</title>
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
        message={state.success ? "Data berhasil dihapus" : "Data gagal dihapus"}
        key={"top" + "center"}
      />
      {user ? (
        <Grid container spacing={2} py={4}>
          <Grid
            sx={{ display: "flex", justifyContent: "center" }}
            item
            xs={12}
            md={4}
          >
            {foto ? (
              <Avatar src={foto} sx={{ height: "20rem", width: "20rem" }} />
            ) : (
              <CircularProgress />
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack>
              <Typography sx={{ textTransform: "capitalize" }} variant="h3">
                {user.name}
              </Typography>
              <Typography variant="subtitle1" component="div">
                <RoomIcon />
                {user.address}
              </Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="primary" component="div">
              Jemaat {user.status}
            </Typography>
            <Typography variant="body1" component="div">
              {getAge(user.birthDate)} tahun
            </Typography>
            <Typography variant="body1" component="div">
              {user.gender}
            </Typography>
            <Typography variant="body1" component="div">
              {user.birthPlace}, {dateFormatter(user.registerAt)}
            </Typography>
            <Typography variant="body1" component="div">
              {user.isMarried}
            </Typography>
            {user.marriedAt && (
              <Typography variant="body1" component="div">
                Menikah pada {dateFormatter(user.marriedAt)}
              </Typography>
            )}
            <Typography variant="body1" component="div">
              Baptis {dateFormatter(user.baptisAt)}
            </Typography>
            <Typography variant="body1" component="div">
              Sidi {dateFormatter(user.sidiAt)}
            </Typography>
            <Typography variant="body1" component="div">
              Sektor {user.sector}
            </Typography>
            <Button
              onClick={() => router.push("/edit")}
              sx={{ mt: 2, mr: 1 }}
              variant="outlined"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(user.id)}
              color="error"
              sx={{ mt: 2 }}
              variant="outlined"
              startIcon={<DeleteIcon />}
            >
              Hapus
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container justifyContent="center" p={4}>
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
};

export default Detail;

export async function getServerSideProps({ query }) {
  const { id } = query;
  return {
    props: { id }, // will be passed to the page component as props
  };
}
