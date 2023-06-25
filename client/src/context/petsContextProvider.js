import { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const PetContext = createContext();

export const PetContextProvider = ({ children }) => {
  const [allpets, setallPets] = useState([]);
  const [randomPets, setRandomPets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [catfacts, setCatfacts] = useState([]);
  const [dogfacts, setDogfacts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [petProfilePhoto, setPetProfilePhoto] = useState(null);
  const backendurl =
    process.env.NODE_ENV === "production"
      ? "https://petadoption-rescueme-backend.onrender.com"
      : "http://localhost:4000";


  const handleLogin = () => {
    setIsLoggedIn(true);

  };
  const handleLogout = async () => {
    try {
      await axios.get(`${backendurl}/api/users/logout`,  {
        withCredentials: true,
      });
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoggedIn(false);
  };

  useEffect(() => {
    fetchData();
    fetchRandomPets();
    fetchRandomFactsCats();
    // fetchRandomFactsDogs();
    fetchMe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendurl}/api/pets/`, {
        withCredentials: true,
      });
      setallPets(res.data.data.pets);
      console.log(res);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendurl}/api/users/getMe`,{ withCredentials: true});
     
      console.log("Fetch Me", res.data.data);
      setUser(res.data.data);
      // if you want to set favourites based on the user and update just favourites in the pet card component
      handleLogin();
    } catch (error) {
      console.log(error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${backendurl}/api/pets/random/`);

      setRandomPets(data);
      console.log(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomFactsCats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://catfact.ninja/facts");
      const data = await res.json();
      console.log(data);

      setCatfacts(data.data);
      // console.log(catfacts);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchRandomFactsDogs = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await fetch("https://dogapi.dog/api/v2/facts");
  //     const data = await res.json();
  //     // console.log(data);
  //     setDogfacts(data);

  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateMe = async (newName, newEmail) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${backendurl}/api/users/updateMe`, { withCredentials: true}, {
        name: newName,
        email: newEmail,
      });
      setUser(res.data.data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  console.log(user);

  return (
    <PetContext.Provider
      value={{
        allpets,
        randomPets,
        catfacts,
        dogfacts,
        loading,
        setLoading,
        user,
        setUser,
        petProfilePhoto,
        setPetProfilePhoto,
        profilePhoto,
        setProfilePhoto,
        isLoggedIn,
        handleLogin,
        handleLogout,
        updateMe,
        error,
        updateUser,
        fetchMe,
        backendurl,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export default PetContext;
