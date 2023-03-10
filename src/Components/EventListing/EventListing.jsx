import React, { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Button,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import Card from "../ResultCard/Card";
import "./EventListing.css";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { useState } from "react";

function EventListing({ eventList }) {
  const [{ loading }, dispatch] = useDataLayerValue();
  const [userCoordinates, setUserCoordinates] = useState([0, 0]);
  const [userLocation, setUserLocation] = useState();
  const navigate = useNavigate();

  return (
    <div className="event-listing">
      <div className="event-add-btn-container">
        <Button variant="contained" onClick={() => navigate("add-event")}>
          Add Event
        </Button>
      </div>
      <div className="event-listing-controller">
        <div className="event-listing-top">
          <div className="searchbar">
            <input
              type="text"
              className="searchbar-inp"
              placeholder="Search for location or sports"
            />
          </div>
          <div className="filter-box">
            <div className="filter-box-container">
              <div className="filter-container"></div>

              <div className="selected-filter">
                <div className="selected-filter-field">
                  <span>Patia</span>{" "}
                  <Cancel className="remove-filter" fontSize="small" />{" "}
                </div>
              </div>
              <div className="selected-filter">
                <div className="selected-filter-field">
                  <span>Cricket</span>
                  <Cancel className="remove-filter" fontSize="small" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="event-listing-mid">
          <div className="result-count">
            <h2>{eventList?.length}</h2> <span>Events near you</span>
          </div>
          <div className="event-listing-sort">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Location"
                sx={{ borderRadius: "8px", backgroundColor: "white" }}
              >
                <MenuItem value={10}>Relevance</MenuItem>
                <MenuItem value={20}>Newest</MenuItem>
                <MenuItem value={30}>Oldest</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="event-listing-bottom">
        {eventList?.map((event) => (
          <Card event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventListing;
