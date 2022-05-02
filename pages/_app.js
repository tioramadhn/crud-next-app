import { Container } from "@mui/material";
import ButtonAppBar from "../components/Navbar";
import "../styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#fff",
      contrastText: "black",
    },
  },
});

function MyApp({ Component, pageProps, id }) {
  return (
    <ThemeProvider theme={theme}>
     {id && <ButtonAppBar/>}
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
