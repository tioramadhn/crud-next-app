import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Avatar, Button, Stack } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router'
import {useState, useEffect} from 'react'
import useSWR from 'swr';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    // minHeight: `20vh`,
    color: theme.palette.text.secondary,
}));

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function detail() {
    const [person, setPerson] = useState()
    const router = useRouter()

    const { id } = router.query
    const { data, error } = useSWR(`/api/warga?id=${id}`, fetcher)
    
    useEffect(() => {
        if(data){
            setPerson(data.data)
        }
    }, [person, data])
    


    return (
        <Box mt={3} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: "center" }}>
                    <Avatar sx={{ transition: `.6s`, width: { xs: 200, md: 300 }, height: { xs: 200, md: 300 } }} alt="Remy Sharp" src="/blank-profile-picture.png" />

                </Grid>

                <Grid item xs={12} md={8}>
                    <Item >
                        <Grid container>
                            <Grid item xs={4} md={4}>Nama</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.nama}</Grid>
                            <Grid item xs={4} md={4}>Nik</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.nik}</Grid>
                            <Grid item xs={4} md={4}>Tempat, Tanggal Lahir</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.tempatLahir}, {person?.tanggalLahir}</Grid>
                            <Grid item xs={4} md={4}>Alamat</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.alamat}</Grid>
                            <Grid item xs={4} md={4}>Sektor</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.sektor}</Grid>
                            <Grid item xs={4} md={4}>Status Perkawinan</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.statusPerkawinan}</Grid>
                            <Grid item xs={4} md={4}>Status Keaktifan</Grid>
                            <Grid item xs={8}md={8} sx={{display:{xs:'flex'}, justifyContent:{xs:'flex-end', md:'flex-start'}}}>{person?.statusKeaktifan}</Grid>

                        </Grid>
                    </Item>
                    <Stack
                        mt={2}
                        direction="row"
                        justifyContent="flex-start"
                        spacing={3}

                    >
                        <Button variant="contained">Ubah</Button>
                        <Button variant="contained">Hapus</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}
