import React, { useState } from "react";
import Item from "../components/Item";

import styles from "../styles/ItemList.module.css";

const ItemList = ({ props, name, setProp, setId }) => {
  const [isActive, setIsActive] = useState();

  return (
    <ul className={`${styles.card} ${styles.cardBackground}`}>
      {props.length == 0 && <p>No {name} created</p>}
      {props.map((prop, index) => (
        <Item
          prop={prop}
          index={index}
          setProp={setProp}
          setIsActive={setIsActive}
          isActive={isActive}
          key={prop.id}
          setId={setId}
        />
      ))}
    </ul>
  );
};

export default ItemList;
