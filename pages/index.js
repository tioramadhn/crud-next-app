import {
  Grid,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { Box } from "@mui/system";
import { db } from "../firebase/ClientApp";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { getAge } from "../utils/date";

ChartJS.register(ArcElement, Tooltip, Legend);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
   // collection ref
   const colRef = collection(db, "jemaat_users");
   const [user, setUser] = useState();
   const [q, setQ] = useState(query(colRef));
   const [size, setSize] = useState({
     aktif: 0,
     pindah: 0,
     meninggal: 0,
     lakiLaki: 0,
     perempuan: 0,
     remaja: 0,
     anakAnak: 0,
     dewasa: 0,
     lansia: 0,
   })
 
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
       const sizeAktif = user.filter(item => item.status == "Aktif")
       const sizePindah = user.filter(item => item.status == "Pindah")
       const sizeMeninggal = user.filter(item => item.status == "Meninggal")
       const sizeLaki = user.filter(item => item.gender == "Laki-laki")
       const sizePerempuan = user.filter(item => item.gender == "Perempuan")
       const sizeAnak = user.filter(item => getAge(item.birthDate) <= 12)
       const sizeRemaja = user.filter(item => getAge(item.birthDate) > 12 && getAge(item.birthDate) <= 18)
       const sizeDewasa = user.filter(item =>  getAge(item.birthDate) > 18 && getAge(item.birthDate) <= 60)
       const sizeLansia = user.filter(item =>  getAge(item.birthDate) > 60)
      //  console.log(sizeAktif.length)
       setSize(
         {
           aktif: sizeAktif.length,
           pindah: sizePindah.length,
           meninggal: sizeMeninggal.length,
           lakiLaki: sizeLaki.length,
           perempuan: sizePerempuan.length,
           anakAnak: sizeAnak.length,
           remaja: sizeRemaja.length,
           dewasa: sizeDewasa.length,
           lansia: sizeLansia.length
         })
     }
    
   }, [user, size]);

   const dataJK = {
    labels: ["Laki-Laki", "Perempuan"],
    datasets: [
      {
        label: "Jenis Kelamin",
        data: [size.lakiLaki, size.perempuan],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const dataUsia = {
    labels: ["Anak-anak", "Remaja", "Dewasa", "Lansia"],
    datasets: [
      {
        label: "Usia",
        data: [size.anakAnak, size.remaja, size.dewasa, size.lansia],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(54, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  
 
  return (
    <div>
      <Head>
        <title>Beranda</title>
      </Head>
      <Grid my={2} justifyContent="center" container spacing={2}>
      <Grid xs={12} item md={3}>
          <Item
            sx={{
            backgroundColor: '#9C0AFF',
              color: "white",
              textAlign: "start",
              padding: "16px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" component="h2">
                  {size.aktif}
                </Typography>
                <Typography variant="subtitle2" component="h2">
                  Jemaat Aktif
                </Typography>
              </Box>
              <Box sx={{width: '4rem', height: '4rem',backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <AccessibilityNewIcon sx={{ fontSize: 40, color: '#9C0AFF' }}/>
              </Box>
            </Box>
          </Item>
        </Grid>
        <Grid xs={12} item md={3}>
          <Item
            sx={{
            backgroundColor: '#FE306F',
              color: "white",
              textAlign: "start",
              padding: "16px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" component="h2">
                {size.pindah}
                </Typography>
                <Typography variant="subtitle2" component="h2">
                  Jemaat Pindah
                </Typography>
              </Box>
              <Box sx={{width: '4rem', height: '4rem',backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <PersonRemoveIcon sx={{ fontSize: 40, color: '#FE306F' }}/>
              </Box>
            </Box>
          </Item>
        </Grid>
        <Grid xs={12} item md={3}>
          <Item
            sx={{
            backgroundColor: '#F96E41',
              color: "white",
              textAlign: "start",
              padding: "16px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" component="h2">
                {size.meninggal}
                </Typography>
                <Typography variant="subtitle2" component="h2">
                  Jemaat Meninggal
                </Typography>
              </Box>
              <Box sx={{width: '4rem', height: '4rem',backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <CloudOffIcon sx={{ fontSize: 40, color: '#F96E41' }}/>
              </Box>
            </Box>
          </Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Item>
            <Doughnut data={dataJK} />
            <Typography variant="subtitle2" component="h2">
              Jenis Kelamin
            </Typography>
          </Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Item>
            <Doughnut data={dataUsia} />
            <Typography variant="subtitle2" component="h2">
              Usia
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}
