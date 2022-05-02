import HttpsIcon from '@mui/icons-material/Https';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import Head from 'next/head';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
    const [values, setValues] = useState({
        password: '',
        showPassword: false,
      });
    
      const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
      const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

      const handleMasuk = () => {

      }
  return (
    <Grid justifyContent={"center"} alignItems="center" container sx={{height: '100vh'}}>
        <Box sx={{
            backgroundImage: 'url("/wave.svg")',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: -1
            
        }}>
        </Box>
        <Head>
            <title>Login</title>
        </Head>
      <Grid xs={8} md={3} item>
        <Stack spacing={2} component="form" sx={{backgroundColor: 'white',border: '1px solid #e4e6e7', p: 4, borderRadius: '1rem'}}>
          <Typography variant="h4" textAlign="center">
            Login
          </Typography>
          <TextField
            id="input-with-icon-textfield"
            label="Username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        <TextField
            id="input-with-icon-textfield"
            label="Password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HttpsIcon />
                </InputAdornment>
              ),
              endAdornment:
               ( <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>)
            }}
            variant="standard"
          />

          <Button variant='contained' type="submit">Masuk</Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
