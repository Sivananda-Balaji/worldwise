// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import axios from "axios";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_GEOURL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [mapLat, mapLng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoCodingErr, setGeoCodingErr] = useState("");
  const [emoji, setEmoji] = useState("");

  const { addCity, isLoading: formLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    const getCityData = async () => {
      try {
        if (!mapLat && !mapLat) {
          throw new Error("Start by clicking anywhere on the map!!");
        }
        setGeoLoading(true);
        setGeoCodingErr("");
        const response = await axios.get(
          `${BASE_GEOURL}?latitude=${mapLat}&longitude=${mapLng}`
        );
        if (!response.data.countryCode) {
          throw new Error(
            "That doesn't seems to be a city. Please click somewhere else!!😉"
          );
        }
        setCityName(response.data.city || response.data.locality);
        setCountry(response.data.countryName);
        setEmoji(convertToEmoji(response.data.countryCode));
      } catch (err) {
        console.log(err);
        setGeoCodingErr(err.message);
      } finally {
        setGeoLoading(false);
      }
    };
    getCityData();
  }, [mapLat, mapLng]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
    };
    await addCity(newCity);
    navigate("/app/cities");
  };

  if (geoLoading) {
    return <Spinner />;
  }
  if (geoCodingErr) {
    return <Message message={geoCodingErr} />;
  }
  return (
    <form
      className={`${styles.form} ${formLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
