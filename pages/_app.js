import { Container } from "@mui/material";
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
  const router = useRouter()
  const [nav, setNav] = useState(false)
  const [user, setUser] = useState()

  useEffect(()=> {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setNav(true)
        setUser(user)
      }else{
        setNav(false)
      }
      console.log('user status changed:', user)
    })
  },[])

  return (
    <ThemeProvider theme={theme}>
     {nav && <ButtonAppBar user={user} />}
      <Container>
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  );
}

export async function getServerSideProps(ctx) {
  console.log(ctx.req);
  return {
    props: {
      id: false
    },
  };
}

export default MyApp;
