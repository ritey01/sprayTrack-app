import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/List.module.css";

const Item = ({ paddock, index, setLocation, setIsActive, isActive }) => {
  const handleItemClick = () => {
    setLocation(paddock.name);
  };

  return (
    <li
      className={styles.itemCard}
      value={paddock.name}
      style={{
        backgroundColor:
          isActive == index ? "rgb(30, 173, 113, 0.18)" : "#ffff",
        width: isActive == index ? "90%" : "80%",
      }}
      onClick={() => {
        setIsActive(index);
        handleItemClick(index);
      }}
    >
      {isActive == index && (
        <span style={{ color: "#ffff" }}>
          <FontAwesomeIcon className={styles.tick} icon={faCheck} border />
        </span>
      )}
      {paddock.name}
    </li>
  );
};

export default Item;
