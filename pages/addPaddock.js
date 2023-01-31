import React, { useState } from "react";
import AddButton from "../components/AddButton";
import standard from "../styles/Standard.module.css";
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
      <AddButton
        propName={paddockName}
        setProp={setPaddockName}
        href={`/paddock`}
        endpoint={`paddock/postPaddock`}
        redirect={`/addPaddock`}
      />
    </div>
  );
};

export default AddPaddock;
