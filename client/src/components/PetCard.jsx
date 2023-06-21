import React from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import PetContext from "../context/petsContextProvider";
import axios from "axios";

const PetCard = ({ pet, rdmpet}) => {
  console.log(pet);
  const displayPet = rdmpet || pet;
  const [favorite, setFavorite] = useState(false);
  const { user, setUser , backendurl} = useContext(PetContext);
  const navigate = useNavigate();

  const FavHandler = async (e) => {
    if (!favorite) {
       e.stopPropagation();
      try {
        const response = await axios.post(
          `${backendurl}/api/users/favorites`,
          {
            petId: displayPet._id,
          }
        );
        setUser(response.data);
        setFavorite(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await axios.delete(
          `${backendurl}/api/users/favorites`,
          {
            data: {
              petId: displayPet._id,
            },
          }
        );
        setUser(res.data);
        setFavorite(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/api/users/getMe`
        );
        const favorites = response.data.data.user.favorites.map(
          (pet) => pet._id
        );
        setFavorite(favorites.includes(displayPet._id));
      } catch (error) {
        console.error(error);
      }
    };
    checkIfFavorite();
  }, [displayPet._id]);

  const handleCardClick = () => {
    navigate("/petprofile", { state: displayPet });
  };

  return (
    <Card className="card_petcard">
      <div className="linkpet" onClick={handleCardClick}>
        <Card.Img
          variant="top"
          src={
            displayPet.photoURL
              ? displayPet.photoURL
              : "https://picsum.photos/id/200/300"
          }
        />

        <Card.Body>
          <span>
            <i
              className={`${
                favorite ? "fa-solid fa-heart" : "fa-regular fa-heart"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Stop event propagation to prevent navigation
                FavHandler(e);
              }}
            ></i>
          </span>
          <Card.Title>{displayPet.name}</Card.Title>
        </Card.Body>
      </div>
    </Card>
  );
};

export default PetCard;
