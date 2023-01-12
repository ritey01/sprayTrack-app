import React from "react";
import styles from "../styles/Standard.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddItemButton = ({ name, link }) => {
  return (
    <div className={styles.addButtonDisplay}>
      <Link href={link} className={styles.addingButton}>
        {" "}
        <FontAwesomeIcon icon={faPlus} />
        {name}
      </Link>
    </div>
  );
};

export default AddItemButton;
