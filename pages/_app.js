import { Container } from '@mui/material'
import { Fragment } from 'react'
import Navbar from '../components/Navbar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Navbar />
      <Container>
        <Component {...pageProps} />
      </Container>
    </Fragment>
  )
}

export default MyApp
