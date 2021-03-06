import React, { useState, useEffect } from "react";
import "./DayForecast.scss";
import getUserLocation from "../../services/GeolocationService";
import { WeatherService } from "../../services/WeatherService";

const weatherService = new WeatherService();

const DayForecast = props => {
  const weekDaysFull = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const [data, setData] = useState({ loaded: false, isAvailable: false });
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [location, setLocation] = useState([]);

  const today = new Date().getDay();
  const receivedDay = weekDaysFull.indexOf(props.match.params.day);
  const forecastIndex =
    receivedDay - today < 0 ? receivedDay - today + 7 : receivedDay - today;

  useEffect(() => {
    if (forecastIndex > 4 || forecastIndex < 0) {
      setData({ loaded: true, isAvailable: false });
      return;
    }

    getUserLocation().then(res => {
      setLocation(res);
      console.log("Location resolved");
      weatherService.getFiveDaysWeather(res.id, true).then(data => {
        setHourlyWeather(data);
        setData({ loaded: true, isAvailable: true });
      });
    });
  }, []);
  return (
    <div className="Daily">
      <p className="Title">
        {!data.isAvailable && data.loaded
          ? "Weather data for " +
            props.match.params.day +
            " is currently unavailable!"
          : "Weather forecast for " +
            props.match.params.day +
            " in " +
            location.city}
      </p>
      {data.loaded && data.isAvailable ? (
        <div className="TableList">
          <div className="TableHeader">
            <h1>Hourly forecast</h1>
            <div className="HeaderInfo">
              <span>Icon</span>
              <span>Time</span>
              <span>Temp</span>
              <span>Max</span>
              <span>Min</span>
            </div>
          </div>
          {hourlyWeather[forecastIndex].map((value, index) => {
            return (
              <div className="TableRow" key={index}>
                <img
                  src={require("../../assets/weather_icons/" +
                    value.icon +
                    ".svg")}
                  alt="Weather Icon"
                />
                <span>{value.time}</span>
                <span>{value.temp}&deg;</span>
                <span>{value.temp_max}&deg;</span>
                <span>{value.temp_min}&deg;</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="Loading">
          <img src={require("../../assets/loading.svg")} alt="Loading..." />
        </div>
      )}
    </div>
  );
};

export default DayForecast;
