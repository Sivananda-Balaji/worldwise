import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

const Map = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const handleNavigate = () => {
    navigate("form");
  };
  return (
    <div className={styles.mapContainer} onClick={handleNavigate}>
      <p>Map</p>
      <p>
        {lat} - {lng}
      </p>
    </div>
  );
};

export default Map;
