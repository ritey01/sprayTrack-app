import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AddButton from "../components/AddButton";
import styles from "../styles/AddButton.module.css";
import standard from "../styles/Standard.module.css";
import AddItemName from "../components/AddItemName";
import AccessDenied from "../components/accessDenied";

const AddSpray = () => {
  const [spray, setSpray] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [valid, setValid] = useState(false);
  const { data: session } = useSession();
  const labelName = "Spray Name";
  const idName = "sprayName";

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Add a Spray</h1>
          <AddItemName
            labelName={labelName}
            propName={spray}
            setProp={setSpray}
            idName={idName}
          />

          <div className={standard.messageDisplay}>
            {error && <p className={styles.error}>{message}</p>}

            {valid && <p className={standard.error}>Please enter a name</p>}
          </div>

          <div className={standard.addPageButtonDisplay}>
            <Link href={`/makeSpray`} className={styles.addItemButton}>
              Back
            </Link>

            <AddButton
              propName={spray}
              setProp={setSpray}
              href={`/makeSpray`}
              endpoint={`spray/postSpray`}
              setMessage={setMessage}
              setError={setError}
              setValid={setValid}
            />
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default AddSpray;
