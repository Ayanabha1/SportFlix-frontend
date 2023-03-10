import React from "react";
import "./home.css";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { Cancel, PowerSettingsNewRounded } from "@mui/icons-material";
import Card from "../ResultCard/Card";
import MapWrapper from "./MapWrapper/MapWrapper";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import EventListing from "../EventListing/EventListing";
import Sidebar from "../Sidebar/Sidebar";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Event from "../Event/Event";
import { useEffect } from "react";
import { useState } from "react";
function Home({ eventList }) {
  const [{ focusMapToCenter, loggedIn }, dispatch] = useDataLayerValue();
  const navigate = useNavigate();
  // Function to handle login
  const login = () => {
    navigate("login");
    // dispatch({
    //   type: "SET_LOGIN_STATUS",
    //   loggedIn: true,
    // });
  };
  const signup = () => {
    navigate("signup");
  };

  return (
    <>
      <Sidebar />
      <div
        className="user-location"
        onClick={() => {
          dispatch({
            type: "SET_FOCUS_MAP_TO_CENTER",
            focusMapToCenter: true,
          });
        }}
      >
        <MyLocationRoundedIcon sx={{ fontSize: "20px" }} />
      </div>

      <div className="home-login-container">
        {!loggedIn && (
          <div className="home-login-loggedOut-container">
            <button onClick={() => login()}>Login</button>
            <button onClick={() => signup()}>Signup</button>
          </div>
        )}
      </div>
      <div className="Home">
        <div className="home-map">
          <MapWrapper eventList={eventList} />
        </div>
        <div className={`home-container`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Home;
