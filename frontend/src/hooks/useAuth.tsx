import { useEffect, useState } from "react";

export default function useAuth() {
  const [auth, setAuth] = useState<string>("");
  const getAuthToken = () => {
    if (!auth) {
      return sessionStorage.getItem("authToken");
    }
  };
  useEffect(() => {
    sessionStorage.setItem("authToken", auth);
  }, [auth]);

  return { getAuthToken, setAuth };
}
