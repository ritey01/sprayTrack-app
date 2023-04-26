import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AddButton from "../components/AddButton";
import standard from "../styles/Standard.module.css";
import styles from "../styles/AddButton.module.css";
import AddItemName from "../components/AddItemName";
import AccessDenied from "../components/accessDenied";

const AddCrop = () => {
  const [cropName, setCropName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [valid, setValid] = useState(false);
  const { data: session } = useSession();
  const labelName = "Crop Name";
  const idName = "cropName";

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Add a Crop</h1>
          <AddItemName
            labelName={labelName}
            propName={cropName}
            setProp={setCropName}
            idName={idName}
          />

          <div className={standard.messageDisplay}>
            {error && <p className={styles.error}>{message}</p>}

            {valid && <p className={standard.error}>Please enter a name</p>}
          </div>

          <div className={standard.addPageButtonDisplay}>
            <div className={styles.backButton}>
              <Link href={`/crop`} className={styles.addItemButton}>
                Back
              </Link>
            </div>
            <div>
              <AddButton
                propName={cropName}
                setProp={setCropName}
                href={`/crop`}
                endpoint={`crop/postCrop`}
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

export default AddCrop;
