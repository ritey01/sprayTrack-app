import React from "react";
import styles from "../styles/List.module.css";

const Item = ({ prop, index, setProp, setIsActive, isActive, setName }) => {
  return (
    <>
      {prop.is_displayed ? (
        <li
          className={styles.itemCard}
          value={prop.name}
          style={{
            background:
              isActive == index
                ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                : "",
            width: isActive == index ? "90%" : "80%",
            color: isActive == index ? "white" : "#3d3f40",
            border: isActive == index ? "none" : " 1px solid #26bbac",
          }}
          onClick={() => {
            setIsActive(index);
            setProp(prop.id);
            setName(prop.name);
          }}
        >
          {prop.name}
        </li>
      ) : null}
    </>
  );
};

export default Item;
