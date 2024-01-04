import {
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

const myReducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return { ...state, isLoading: false, cities: action.payload };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const Citiesprovider = ({ children }) => {
  const [state, dispatch] = useReducer(myReducer, initialState);
  const { cities, isLoading, currentCity, error } = state;
  useEffect(() => {
    const getData = async () => {
      try {
        dispatch({ type: "loading" });
        const response = await axios.get(`${BASE_URL}/cities`);
        dispatch({ type: "cities/loaded", payload: response.data });
      } catch (err) {
        console.group(err);
        dispatch({ type: "rejected", payload: err.message });
      }
    };
    getData();
  }, []);
  const getCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) {
        return;
      }
      try {
        dispatch({ type: "loading" });
        const response = await axios.get(`${BASE_URL}/cities/${id}`);
        dispatch({ type: "city/loaded", payload: response.data });
      } catch (err) {
        console.log(err);
        dispatch({ type: "rejected", payload: err.message });
      }
    },
    [currentCity.id]
  );
  const addCity = async (newCity) => {
    try {
      dispatch({ type: "loading" });
      const response = await axios.post(`${BASE_URL}/cities`, newCity);
      dispatch({ type: "city/created", payload: response.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: "rejected", payload: err.message });
    }
  };
  const deleteCity = async (id) => {
    try {
      dispatch({ type: "loading" });
      await axios.delete(`${BASE_URL}/cities/${id}`);
      const updatedCities = cities.filter((city) => city.id !== id);
      dispatch({ type: "city/deleted", payload: updatedCities });
    } catch (err) {
      console.log(err);
      dispatch({ type: "rejected", payload: err.message });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  return context;
};

export { Citiesprovider, useCities };
