import React from "react";
import styles from "../styles/AddItemName.module.css";

const AddItemName = ({ labelName, propName, setProp }) => {
  return (
    <form>
      <div className={styles.styledCard}>
        <div className={styles.name}>
          <label htmlFor={propName}>{labelName}</label>
          <input
            className={styles.input}
            id={propName}
            type="string"
            required
            value={propName}
            onChange={(e) => setProp(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default AddItemName;
