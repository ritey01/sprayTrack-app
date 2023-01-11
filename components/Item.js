import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/List.module.css";

const Item = ({ prop, index, setProp, setIsActive, isActive }) => {
  const handleItemClick = () => {
    setProp(prop.name);
  };

  return (
    <li
      className={styles.itemCard}
      value={prop.name}
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
      {prop.name}
    </li>
  );
};

export default Item;
