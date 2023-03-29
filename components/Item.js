import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/List.module.css";

const Item = ({ prop, index, setProp, setIsActive, isActive, setName }) => {
  return (
    <>
      {prop.is_displayed ? (
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
            setProp(prop.id);
            setName(prop.name);
          }}
        >
          {isActive == index && (
            <span style={{ color: "#ffff" }}>
              <FontAwesomeIcon className={styles.tick} icon={faCheck} border />
            </span>
          )}
          {prop.name}
        </li>
      ) : null}
    </>
  );
};

export default Item;
