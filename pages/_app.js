import { Backdrop, CircularProgress, Container } from "@mui/material";
import ButtonAppBar from "../components/Navbar";
import "../styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/ClientApp";
import { useRouter } from "next/router";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#fff",
      contrastText: "black",
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [nav, setNav] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setNav(true);
      } else {
        setNav(false);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {nav && <ButtonAppBar/>}
      <Container>
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  );
}

export default MyApp;
