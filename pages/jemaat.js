import { Button, Container, Grid, IconButton, Stack } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import BasicTable from "../components/Table";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase/ClientApp";
import { collection } from "firebase/firestore";

export default function Jemaat() {
  const router = useRouter();
  const [data, setData] = useState([]);

  const [users, usersLoading, usersError] = useCollection(
    collection(db, "jemaat_users"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    if (users) {
      setData(users.docs.map((doc) => doc.data()));
    }
  }, [data, users]);

  return (
    <div>
      <Head>
        <title>Data Jemaat</title>
      </Head>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ p: 4 }}>
        <Grid item>
          <Link href="/add">
            <Button variant="contained" startIcon={<AddIcon />}>
              Tambah
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <BasicTable rows={data} />
        </Grid>
      </Grid>
    </div>
  );
}
