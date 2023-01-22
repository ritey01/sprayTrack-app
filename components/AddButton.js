import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/AddButton.module.css";
import { router } from "next/router";

const AddButton = ({ propName, href, endpoint }) => {
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    if (propName) {
      // send request to the server
      try {
        const body = { name: propName };

        const result = await fetch(`/api/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        console.log(result);
        await router.replace(router.asPath);
      } catch (error) {
        console.error(error);
      }
    } else {
      //need to create a state for this
      setError("Please enter a name");
      return;
    }
  };
  return (
    <div className={styles.buttonDisplay}>
      {error && <p className={styles.error}>{error}</p>}
      <Link href={href} className={styles.addItemButton} onClick={handleSubmit}>
        Add
      </Link>
    </div>
  );
};

export default AddButton;
