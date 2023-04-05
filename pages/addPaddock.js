import React, { useState } from "react";
import Link from "next/link";
import AddButton from "../components/AddButton";
import standard from "../styles/Standard.module.css";
import styles from "../styles/AddButton.module.css";
import AddItemName from "../components/AddItemName";

const AddPaddock = () => {
  const [paddockName, setPaddockName] = useState("");
  const labelName = "Paddock Name";
  const idName = "paddockName";

  return (
    <div>
      <h1 className={standard.title}>Add a Paddock</h1>
      <AddItemName
        labelName={labelName}
        propName={paddockName}
        setProp={setPaddockName}
        idName={idName}
      />
      <div className={standard.addPageButtonDisplay}>
        <Link href={`/paddock`} className={styles.addItemButton}>
          Back
        </Link>

        <AddButton
          propName={paddockName}
          setProp={setPaddockName}
          href={`/paddock`}
          endpoint={`paddock/postPaddock`}
        />
      </div>
    </div>
  );
};

export default AddPaddock;
