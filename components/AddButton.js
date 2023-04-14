// import React, { useState } from "react";
import styles from "../styles/AddButton.module.css";

import { useRouter } from "next/router";

const AddButton = ({
  propName,
  href,
  endpoint,
  setMessage,
  setError,
  setValid,
}) => {
  const router = useRouter();

  const handleSubmit = async () => {
    if (propName) {
      // send request to the server

      const body = { name: propName };

      const result = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!result.ok) {
        if (result.status === 400) {
          setMessage(propName + " already exists");
        } else {
          setMessage(result.statusText);
        }

        console.error(result.status);
        setError(true);
      } else {
        router.push(href);
      }
    } else {
      setValid(false);
      setMessage("Please enter a name");
      return;
    }
  };

  return (
    <>
      {propName ? (
        <button className={styles.addItemButton} onClick={handleSubmit}>
          Add
        </button>
      ) : (
        <button
          className={styles.addItemButton}
          onClick={() => {
            setValid(true);
          }}
        >
          Add
        </button>
      )}
    </>
  );
};

export default AddButton;
