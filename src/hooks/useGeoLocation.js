import { useState } from "react";

const useGeoLocation = (defaultLocation = null) => {
  const [location, setLocation] = useState(defaultLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const getMyLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(newLocation);
        setError("");
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
        setLocation({});
      }
    );
  };
  return { location, isLoading, error, getMyLocation };
};

export { useGeoLocation };
