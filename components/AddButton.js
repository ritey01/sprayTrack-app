import React from "react";
import Link from "next/link";
import styles from "../styles/AddButton.module.css";
import { router } from "next/router";

const AddButton = ({ propName, href, endpoint }) => {
  const handleSubmit = async () => {
    if (propName) {
      // send request to the server
      try {
        const body = { name: propName };

        await fetch(`/api/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        await router.replace(router.asPath);
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
