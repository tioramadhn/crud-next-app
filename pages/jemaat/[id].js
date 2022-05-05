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
import { auth, db, storage } from "../../firebase/ClientApp";
import {
  Avatar,
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
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
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

const Detail = ({ id }) => {
  const router = useRouter();
  const docRef = doc(db, "jemaat_users", id);
  const [user, setUser] = useState();
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

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login");
      }
    });

    if (user) {
      if (user.foto) {
        getDownloadURL(ref(storage, user.foto)).then((url) => {
          setFoto(url);
        });
      } else {
        setFoto("blank-profile-picture.png");
      }
    }
  }, [user]);

  const handleDelete = (id) => {
    setOpen(false);
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
    setOpen(false);
    setState({ success: false, loading: false, error: false });
  };
  const [open, setOpen] = useState(false);

  const dataNotSet = (msg) => (
    <Typography
      variant="body1"
      color="error"
      sx={{ fontStyle: "italic" }}
      component="div"
    >
      {msg}
    </Typography>
  );

  return (
    <div>
      <Head>
        <title>Detail jemaat</title>
      </Head>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Apakah anda yakin ingin menghapus ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Klik lanjut untuk menghapus data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>batal</Button>
          <Button onClick={() => handleDelete(user.id)} autoFocus>
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
              <Skeleton variant="circular" width={"20rem"} height={"20rem"} />
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography sx={{ textTransform: "capitalize" }} variant="h4">
              {user.name}
            </Typography>
            <Stack direction="row">
              <RoomIcon sx={{ width: "1rem" }} />
              {user.address ? (
                <Typography variant="subtitle1" component="div">
                  {user.address}
                </Typography>
              ) : (
                dataNotSet("Data belum ada")
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={4}>
              <Stack>
                <Typography variant="body1" component="div">
                  Keanggotaan
                </Typography>
                {user.moveAt && (
                  <Typography variant="body1" component="div">
                    Tanggal Pindah
                  </Typography>
                )}
                {user.deadAt && (
                  <Typography variant="body1" component="div">
                    Tanggal Meninggal
                  </Typography>
                )}
                <Typography variant="body1" component="div">
                  No. Stambuk
                </Typography>
                <Typography variant="body1" component="div">
                  Usia
                </Typography>
                <Typography variant="body1" component="div">
                  Jenis Kelamin
                </Typography>
                <Typography variant="body1" component="div">
                  Tempat, Tanggal Lahir
                </Typography>
                <Typography variant="body1" component="div">
                  NIK
                </Typography>
                <Typography variant="body1" component="div">
                  Nama Ayah/Ibu
                </Typography>
                <Typography variant="body1" component="div">
                  Status
                </Typography>
                {user.marriedAt && (
                  <Typography variant="body1" component="div">
                    Tanggal Menikah
                  </Typography>
                )}
                <Typography variant="body1" component="div">
                  Tanggal Baptis
                </Typography>
                <Typography variant="body1" component="div">
                  Tanggal Sidi
                </Typography>
                <Typography variant="body1" component="div">
                  Tanggal Registrasi
                </Typography>
                <Typography variant="body1" component="div">
                  Sektor
                </Typography>
              </Stack>
              <Stack textAlign="start">
                <Typography variant="body1" color="primary" component="div">
                  Jemaat {user.status}
                </Typography>

                {user.moveAt && (
                  <Typography variant="body1" component="div">
                    {dateFormatter(user.moveAt)}
                  </Typography>
                )}

                {user.deadAt && (
                  <Typography variant="body1" component="div">
                    {dateFormatter(user.deadAt)}
                  </Typography>
                )}

                {user.numStambuk ? (
                  <Typography variant="body1" component="div">
                    {user.numStambuk}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                {user.birthDate ? (
                  <Typography variant="body1" component="div">
                    {getAge(user.birthDate)} tahun
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                <Typography variant="body1" component="div">
                  {user.gender}
                </Typography>

                {user.birthPlace && user.birthDate ? (
                  <Typography variant="body1" component="div">
                    {user.birthPlace}, {dateFormatter(user.birthDate)}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                {user.nik ? (
                  <Typography variant="body1" component="div">
                    {user.nik}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                {user.motherName && user.fatherName? (
                  <Typography variant="body1" component="div">
                    {user.fatherName}/{user.motherName}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                <Typography variant="body1" component="div">
                  {user.isMarried}
                </Typography>

                {user.marriedAt && (
                  <Typography variant="body1" component="div">
                    {dateFormatter(user.marriedAt)}
                  </Typography>
                )}

                {user.baptisAt ? (
                  <Typography variant="body1" component="div">
                    {dateFormatter(user.baptisAt)}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                {user.sidiAt ? (
                  <Typography variant="body1" component="div">
                    {dateFormatter(user.sidiAt)}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                {user.registerAt ? (
                  <Typography variant="body1" component="div">
                    {dateFormatter(user.registerAt)}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}

                {user.sector ? (
                  <Typography variant="body1" component="div">
                    {user.sector}
                  </Typography>
                ) : (
                  dataNotSet("Data belum ada")
                )}
              </Stack>
            </Stack>
            <Link href={`/edit/${user.id}`} passHref>
              <Button
                sx={{ mt: 2, mr: 1 }}
                variant="outlined"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            </Link>

            <Button
              onClick={() => setOpen(true)}
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

export async function getServerSideProps({ req, query }) {
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
  const { id } = query;
  return {
    props: { id }, // will be passed to the page component as props
  };
}
