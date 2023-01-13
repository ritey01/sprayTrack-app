import React from "react";
import styles from "../styles/AddItemName.module.css";

const AddItemName = ({ labelName, propName, setProp, idName }) => {
  return (
    <form>
      <div className={styles.styledCard}>
        <div className={styles.name}>
          <label htmlFor={idName}>{labelName} </label>
          <input
            className={styles.input}
            id={idName}
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
