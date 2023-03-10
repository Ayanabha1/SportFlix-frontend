import logo from "./logo.svg";
import "./App.css";
import Home from "./Components/Home/Home";
import Sidebar from "./Components/Sidebar/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventListing from "./Components/EventListing/EventListing";
import HomeDock from "./Components/Home/HomeDock";
import Event from "./Components/Event/Event";
import img1 from "./Common resources/img1.jpg";
import img2 from "./Common resources/img2.png";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";
import { Backdrop, CircularProgress } from "@mui/material";
import Loader from "./Components/Loader/Loader";
import { useDataLayerValue } from "./Datalayer/DataLayer";
import Response from "./Response/Response";
import { useEffect, useState } from "react";
import { Api } from "./Api/Axios";
import ProtectedRoute from "./Utils/ProtectedRoute";
import AddEventForm from "./Components/Add Event Form/AddEventForm";
import axios from "axios";
import RegisteredEvents from "./Components/RegisteredEvents/RegisteredEvents";

function App() {
  const [eventList, setEventList] = useState([]);

  const [{ loading, responseData, userData }, dispatch] = useDataLayerValue();

  // Function to login on reload

  const loginOnReload = async () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      await Api.get("/auth/getUser")
        .then((res) => {
          console.log(res.data);
          dispatch({
            type: "SET_USER_DATA",
            userData: res.data,
          });
          dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: true,
          });
        })
        .catch((err) => {
          localStorage.removeItem("AUTH_TOKEN");
          dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: false,
          });
          dispatch({
            type: "SET_USER_DATA",
            userData: {},
          });
        });
    } else {
      dispatch({
        type: "SET_LOGIN_STATUS",
        loggedIn: false,
      });
    }
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  // Function to login on reload ends here

  // Functions to get event list
  const getCoords = async () => {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      lng: pos.coords.longitude,
      lat: pos.coords.latitude,
    };
  };

  const getEventList = async () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    const userCoords = await getCoords();
    console.log(userCoords);

    await Api.get("/events/get-nearest-events", {
      params: { lat: userCoords.lat, lng: userCoords.lng },
    })
      .then((res) => {
        let events = res.data;
        let unsortedNearestEvents = res.data?.nearestEvents;
        unsortedNearestEvents.sort(
          (e1, e2) => new Date(e1.date).getTime() - new Date(e2.date).getTime()
        );
        res.data.nearestEvents = unsortedNearestEvents;
        console.log(res.data);
        setEventList(events);
        dispatch({
          type: "SET_EVENT_LIST",
          eventList: events,
        });
      })
      .catch((err) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: "Something went wrong ... please try reloading",
            type: "error",
          },
        });
      });

    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  // Functions to get event list ends here

  useEffect(() => {
    loginOnReload();
    getEventList();
  }, []);

  return (
    <div className="App">
      <div className="main-app-dock">
        <Router>
          <Routes>
            <Route path="/" element={<Home eventList={eventList?.allEvents} />}>
              <Route
                index
                element={<EventListing eventList={eventList?.nearestEvents} />}
              />
              <Route
                path="event/:id"
                element={<Event eventList={eventList?.allEvents} />}
              />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<Profile />} />
                <Route path="add-event" element={<AddEventForm />} />
                <Route
                  path="registered-events"
                  element={<RegisteredEvents />}
                />
              </Route>
              <Route
                path="*"
                element={<EventListing eventList={eventList?.nearestEvents} />}
              />
            </Route>
          </Routes>
        </Router>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: "5000000000" }} open={loading}>
        <Loader />
      </Backdrop>

      {/* Response (i.e. Error and success messages) */}
      {responseData && <Response />}
    </div>
  );
}

export default App;
