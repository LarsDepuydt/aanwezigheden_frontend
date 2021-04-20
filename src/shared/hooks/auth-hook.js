import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [userId, setUserId] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [vid, setVid] = useState(null);
  const [vereniging, setVereniging] = useState(null);

  const login = useCallback(
    (uid, token, admin = false, vereniging = "", expirationDate) => {
      setToken(token);
      setUserId(uid);
      setAdmin(admin);
      setVereniging(vereniging);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 30);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          admin: admin,
          vereniging: vereniging,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setAdmin(null);
    localStorage.removeItem("userData");
  }, []);

  const setVidFunction = useCallback((vid) => {
    setVid(vid);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.admin || false,
        storedData.vereniging,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return {
    token,
    admin,
    login,
    logout,
    userId,
    vid,
    setVid: setVidFunction,
    vereniging,
  };
};
