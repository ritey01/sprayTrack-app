import React, { useState } from "react";
import Item from "../components/Item";

import styles from "../styles/ItemList.module.css";

const ItemList = ({ props, name, setLocation }) => {
  const [isActive, setIsActive] = useState();
  return (
    <ul className={`${styles.card} ${styles.cardBackground}`}>
      {props.paddocks.length == 0 && <p>No {name} created</p>}
      {props.paddocks.map((paddock, index) => (
        <Item
          paddock={paddock}
          index={index}
          setLocation={setLocation}
          setIsActive={setIsActive}
          isActive={isActive}
          key={paddock.id}
        />
      ))}
    </ul>
  );
};

export default ItemList;
