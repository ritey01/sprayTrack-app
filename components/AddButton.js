import React from "react";
import Link from "next/link";
import styles from "../styles/AddButton.module.css";

const AddButton = ({ propName, href }) => {
  const handleSubmit = async () => {
    if (propName) {
      // send request to the server
      try {
        const body = { name: propName };

        await fetch(`/api/postName`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setError("Please enter a name");
      return;
    }
  };
  return (
    <div className={styles.buttonDisplay}>
      <Link href={href} className={styles.addItemButton} onClick={handleSubmit}>
        Add
      </Link>
    </div>
  );
};

export default AddButton;
