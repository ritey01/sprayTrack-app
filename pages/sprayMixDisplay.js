import React, { useState, useContext } from "react";
import Link from "next/link";
import styles from "../styles/SprayMixDisplay.module.css";
import standard from "../styles/Standard.module.css";
import SprayContext from "../context/sprayEvent";

const SprayMixDisplay = ({ sprayMixs }) => {
  const [sprayMixName, setSprayMixName] = useState("");
  //may need a spraymix state here maybe split with spray and mix?
  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMix, setSprayMix] = mix;
  console.log(sprayEvent);

  const handleSubmit = async () => {
    const result = await fetch(`/api/spray/postSprayList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(body),
    });
    console.log("🥶", result);
  };

  const resetData = (index) => {
    //removes the selected spray from the array
    const newSprayEvent = { ...sprayEvent };
    newSprayEvent.sprayMix.mixs.splice(index, 1);
    setSprayEvent(newSprayEvent);
  };

  const addSprayMix = () => {
    //Adds the spray mix to the sprayMixs array
    sprayMixs.push({
      name: sprayMixName,
      mixs: sprayEvent.sprayMix.mixs,
    });
    //Adds the spray mix to the sprayEvent object
    const newSprayEvent = { ...sprayEvent };
    newSprayEvent.sprayMix.name = sprayMixName;
    setSprayEvent(newSprayEvent);
  };

  return (
    <button onClick={handleSubmit}>Click me</button>
    // <div>
    //   <h1 className={standard.title}>Spray Mix</h1>
    //   <div className={`${standard.cardBackground} ${styles.sprayMixDisplay}`}>
    //     {sprayEvent.sprayMix.mixs.length == 0 && (
    //       <p className={styles.noSprayMessage}>No spray entered</p>
    //     )}

    //     {/* If there is more than one spray in the spray mix, display the form to add a name to the spray mix */}
    //     {sprayEvent.sprayMix.mixs.length > 1 && (
    //       <form>
    //         {" "}
    //         <label htmlFor="sprayMixName" className={styles.formLabel}>
    //           Spray Mix Name
    //         </label>
    //         <input
    //           className={styles.formName}
    //           id="sprayMixName"
    //           type="string"
    //           required
    //           value={sprayMixName}
    //           onChange={(e) => setSprayMixName(e.target.value)}
    //         />
    //       </form>
    //     )}
    //     {sprayEvent.sprayMix.mixs.map((spray, index) => {
    //       //   {
    //       //     !sprayEvent.sprayMix.mixs[0] && <p>No spray entered</p>;
    //       //   }
    //       const numberedRate = parseInt(spray.rate);
    //       const numberedArea = parseInt(spray.sprayArea);

    //       return (
    //         <div className={styles.sprayDetails}>
    //           <p>{spray.spray}</p>
    //           <p>
    //             {spray.rate} {spray.unit} per {spray.sprayArea}{" "}
    //             {spray.sprayArea > 1 ? (
    //               <span>hectares</span>
    //             ) : (
    //               <span>hectare</span>
    //             )}
    //           </p>
    //           <Link
    //             href={`/makeSpray`}
    //             onClick={() => resetData(index)}
    //             className={styles.editBtn}
    //           >
    //             Edit
    //           </Link>
    //         </div>
    //       );
    //     })}
    //     <Link href={`/makeSpray`} className={styles.editBtn}>
    //       Add another spray
    //     </Link>
    //   </div>

    //   <div className={standard.styledNext}>
    //     <Link href={`/sprayRate`} className={standard.next}>
    //       Back
    //     </Link>
    //     <Link
    //       to={`/sprayDetails`}
    //       className={standard.next}
    //       onClick={() => addSprayMix()}
    //     >
    //       Done
    //     </Link>
    //   </div>
    // </div>
  );
};
export default SprayMixDisplay;
