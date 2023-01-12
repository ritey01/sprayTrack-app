import React, { useState } from "react";
import AddButton from "../components/AddButton";
import standard from "../styles/Standard.module.css";
import AddItemName from "../components/AddItemName";

const AddPaddock = () => {
  const [paddockName, setPaddockName] = useState("");
  const labelName = "Paddock Name";

  return (
    <div>
      <h1 className={standard.title}>Create a Paddock</h1>
      <AddItemName
        labelName={labelName}
        propName={paddockName}
        setProp={setPaddockName}
      />
      <AddButton
        propName={paddockName}
        setProp={setPaddockName}
        href={`/paddock`}
      />
    </div>
  );
};

export default AddPaddock;
