import React, { useState } from "react";
import { useSession } from "next-auth/react";
import AddButton from "../components/AddButton";
import standard from "../styles/Standard.module.css";
import AddItemName from "../components/AddItemName";
import AccessDenied from "../components/accessDenied";

const AddCrop = () => {
  const [cropName, setCropName] = useState("");
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
          <AddButton
            propName={cropName}
            setProp={setCropName}
            href={`/crop`}
            endpoint={`crop/postCrop`}
          />
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default AddCrop;
