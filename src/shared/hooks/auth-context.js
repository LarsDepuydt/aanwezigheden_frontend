import React from "react";

export const AuthContext = React.createContext({
  isAuth: false,
  userId: "",
  token: "",
  csrf: "",
  admin: false,
  vid: "",
  login: () => {},
  logout: () => {},
  setVid: () => {},
});
