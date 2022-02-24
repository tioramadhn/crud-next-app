import { Button, Divider, Stack, Typography } from '@mui/material';
import CustomTable from '../components/CustomTable';
import PersonAddAlt1SharpIcon from '@mui/icons-material/PersonAddAlt1Sharp';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home() {
  const router = useRouter()
  const { data, error } = useSWR('/api/warga', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const handleAdd = () => {
    router.push('/tambah')
  }

  return (
    <div>
      <Stack
        direction={{xs: 'column', md:"row"}}
        justifyContent="space-between"
        spacing={2}
        my={3}
      >
        <Typography variant="h5">
          Jemaat BNKP Efrata Pangkalan Kerinci
          Resort 60 BNKP
        </Typography>
        <Button onClick={handleAdd} variant="contained" startIcon={<PersonAddAlt1SharpIcon/>}>
         Tambah
        </Button>
      
      </Stack>
      <Divider sx={{ marginBottom: '2em' }} />

      <CustomTable data={data} />

    </div >
  )
}
