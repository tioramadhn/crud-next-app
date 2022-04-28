import {
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { Chart } from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { Box } from "@mui/system";

ChartJS.register(ArcElement, Tooltip, Legend);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const data = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
};

export default function Home() {
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
                  2000
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
                  535
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
                  786
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

        <Grid item md={4}>
          <Item>
            <Doughnut data={data} />
            <Typography variant="subtitle2" component="h2">
              Jenis Kelamin
            </Typography>
          </Item>
        </Grid>

        <Grid item md={4}>
          <Item>
            <Doughnut data={data} />
            <Typography variant="subtitle2" component="h2">
              Usia
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}
