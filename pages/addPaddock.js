import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AddButton from "../components/AddButton";
import standard from "../styles/Standard.module.css";
import styles from "../styles/AddButton.module.css";
import AddItemName from "../components/AddItemName";
import AccessDenied from "../components/accessDenied";

const AddPaddock = () => {
  const [paddockName, setPaddockName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [valid, setValid] = useState(false);
  const { data: session } = useSession();
  const labelName = "Paddock Name";
  const idName = "paddockName";

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Add Paddock</h1>
          <AddItemName
            labelName={labelName}
            propName={paddockName}
            setProp={setPaddockName}
            idName={idName}
          />

          <div className={standard.messageDisplay}>
            {error && <p className={styles.error}>{message}</p>}

            {valid && <p className={standard.error}>Please enter a name</p>}
          </div>

          <div className={standard.addPageButtonDisplay}>
            <div className={styles.backButton}>
              <Link href={`/paddock`} className={styles.addItemButton}>
                Back
              </Link>
            </div>

            <div>
              <AddButton
                propName={paddockName}
                setProp={setPaddockName}
                href={`/paddock`}
                endpoint={`paddock/postPaddock`}
                setMessage={setMessage}
                setError={setError}
                setValid={setValid}
              />
            </div>
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default AddPaddock;
