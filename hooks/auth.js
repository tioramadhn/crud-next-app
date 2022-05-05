import { Backdrop, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/ClientApp";

export function withPublic(Component) {
  return function WithPublic(props) {
    const router = useRouter();
    const [user, authLoading, authError] = useAuthState(auth);

    if (user) {
      router.replace("/");
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    } else if (authLoading) {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }

    return <Component {...props} />;
  };
}

export function withProtected(Component) {
  return function WithProtected(props) {
    const router = useRouter();
    const [user, authLoading, authError] = useAuthState(auth);

    if (!user) {
      router.replace("/auth/login");
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    } else if (authLoading) {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }

    return <Component {...props} />;
  };
}
