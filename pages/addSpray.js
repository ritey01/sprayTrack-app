import React, { useState } from "react";
import Link from "next/link";
import AddButton from "../components/AddButton";
import styles from "../styles/AddButton.module.css";
import standard from "../styles/Standard.module.css";
import AddItemName from "../components/AddItemName";

const AddSpray = () => {
  const [spray, setSpray] = useState("");
  const labelName = "Spray Name";
  const idName = "sprayName";

  return (
    <div>
      <h1 className={standard.title}>Add a Spray</h1>
      <AddItemName
        labelName={labelName}
        propName={spray}
        setProp={setSpray}
        idName={idName}
      />
      <div className={standard.addPageButtonDisplay}>
        <div>
          <Link href={`/makeSpray`} className={styles.addItemButton}>
            Back
          </Link>
        </div>
        <AddButton
          propName={spray}
          setProp={setSpray}
          href={`/makeSpray`}
          endpoint={`spray/postSpray`}
        />
      </div>
    </div>
  );
};

export default AddSpray;
