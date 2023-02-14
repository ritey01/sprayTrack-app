import React, { useState, useContext } from "react";
import Link from "next/link";
import styles from "../styles/sprayMixDisplay.module.css";
import standard from "../styles/Standard.module.css";
import SprayContext from "../context/sprayEvent";

const SprayMixDisplay = () => {
  const [sprayMixName, setSprayMixName] = useState("");

  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMix, setSprayMix] = mix;

  const handleSubmit = async () => {};

  const resetData = (index) => {
    //removes the selected spray from the array
    // const newSprayEvent = { ...sprayEvent };
    // newSprayEvent.sprayMix.mixs.splice(index, 1);
    // setSprayEvent(newSprayEvent);
    const newSprayMix = { ...sprayMix };
    newSprayMix.sprays.splice(index, 1);
    setSprayMix(newSprayMix);
  };

  const addSprayMix = async () => {
    //Adds the spray mix to the sprayMixs array
    // sprayMixs.push({
    //   name: sprayMixName,
    //   mixs: sprayEvent.sprayMix.mixs,
    // });
    //Adds the spray mix to the sprayEvent object
    const newSprayMix = { ...sprayMix };
    newSprayMix.name = sprayMixName;
    const newSprayEvent = { ...sprayEvent };
    newSprayEvent.sprayList = newSprayMix;
    setSprayEvent(newSprayEvent);
    console.log("last 😈", sprayEvent);
    //need to reset the sprayMix object
    //do this with route change incase it errors?
    // setSprayMix({
    //   name: "",
    //   sprays: [{ spray: "", rate: "", unit: "" }],
    // });

    //saves the created spraymix for later use
    const body = { name: sprayMixName, sprays: sprayMix.sprays };
    const result = await fetch(`/api/spray/postSprayList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  return (
    <div>
      <h1 className={standard.title}>Spray Mix</h1>
      <div className={`${standard.cardBackground} ${styles.sprayMixDisplay}`}>
        {sprayMix.sprays.length == 0 && (
          <p className={styles.noSprayMessage}>No spray entered</p>
        )}

        {/* If there is more than one spray in the spray mix, display the form to add a name to the spray mix */}

        <form>
          {" "}
          <label htmlFor="sprayMixName" className={styles.formLabel}>
            Spray Mix Name
          </label>
          <input
            className={styles.formName}
            id="sprayMixName"
            type="string"
            required
            value={sprayMixName}
            onChange={(e) => setSprayMixName(e.target.value)}
          />
        </form>

        {sprayMix.sprays.map((spray, index) => {
          //   {
          //     !sprayEvent.sprayMix.mixs[0] && <p>No spray entered</p>;
          //   }
          //const numberedRate = parseInt(spray.rate);
          //const numberedArea = parseInt(spray.sprayArea);

          return (
            <>
              <div className={styles.sprayDetails}>
                <p>{spray.spray}</p>
                <p>
                  {spray.rate} {spray.unit} per{" "}
                  {spray.sprayArea > 1 ? (
                    <span>hectares</span>
                  ) : (
                    <span>hectare</span>
                  )}
                </p>
                <Link
                  href={`/makeSpray`}
                  onClick={() => resetData(index)}
                  className={styles.editBtn}
                >
                  Edit
                </Link>
              </div>
            </>
          );
        })}
        <Link href={`/makeSpray`} className={styles.editBtn}>
          Add another spray
        </Link>
      </div>

      <div className={standard.styledNext}>
        <Link href={`/sprayRate`} className={standard.next}>
          Back
        </Link>
        <Link
          href={`/sprayDetails`}
          className={standard.next}
          onClick={() => addSprayMix()}
        >
          Done
        </Link>
      </div>
    </div>
  );
};
export default SprayMixDisplay;
