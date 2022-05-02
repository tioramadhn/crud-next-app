import { Grid, Typography, Stack } from "@mui/material"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Custom404() {
    const router = useRouter()
    const [detik, setDetik] = useState(3)

    useEffect(()=>{
        setTimeout(() => {
            router.push('/')
        }, 3000);
    },[])

    return (
    <Grid p={8} container justifyContent="center">
        <Head>
            <title>Page Not Found</title>
        </Head>
        <Stack>
        <Image alt="404 image" src={'/404.png'}width={1100-200}
      height={731-200} layout="responsive"/>
        <Typography variant="h4">
        404 - Halaman tidak ditemukan
        </Typography>
        <Typography variant="caption">
            Kembali ke halaman utama dalam {detik} detik...
        </Typography>
        </Stack>
    </Grid>
    )
}

