import { Container } from '@mui/material'
import ButtonAppBar from '../components/Navbar'
import '../styles/globals.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
      contrastText: 'black',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar />
      <Container>
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  )
}

export default MyApp
