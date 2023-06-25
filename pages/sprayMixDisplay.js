import React, { useState, useContext } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "../styles/SprayMixDisplay.module.css";
import standard from "../styles/Standard.module.css";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";

const SprayMixDisplay = () => {
  const [sprayMixName, setSprayMixName] = useState(
    (typeof window !== "undefined" && localStorage.getItem("title")) || ""
  );
  const [name, setName] = useState("");
  const { event, oneMix, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;

  //Creates one spray creation with multiple sprays
  const [sprayMix, setSprayMix] = oneMix;

  //Creates multiple spray creations with multiple sprays
  const [multiMix, setMultiMix] = mix;
  const [error, setError] = useState(false);
  const { data: session } = useSession();

  const deleteSpray = (index) => {
    //removes the selected spray from the array
    const newSprayMix = { ...sprayMix };
    newSprayMix.sprays.splice(index, 1);
    setSprayMix(newSprayMix);
  };

  const resetData = (index) => {
    const newSprayMix = { ...sprayMix };
    newSprayMix.sprays.splice(index, 1);
    setSprayMix(newSprayMix);
  };
  const handleSprayMixTitle = () => {
    //saves the spray mix name for display on the card between adding sprays
    setSprayMixName(name);
    localStorage.setItem("title", name);
  };

  const addSprayMix = async () => {
    //Copy sprayMix and add sprayMixName to sprayMix.sprays array

    const newSprayMix = {
      ...sprayMix,
      title: sprayMixName,
    };

    //Resets storage for title to empty string
    localStorage.removeItem("title");

    //saves the created spraymix for later use
    const body = { title: sprayMixName, sprays: sprayMix.sprays };
    const result = await fetch(`/api/spray/postSprayList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await result.json();

    // Set spraymix id for sprayevent to be saved
    newSprayMix.id = data.id;

    setSprayMix(newSprayMix);
    //Add single sprayEvent to the multiMix to allow multiple single sprayMixesto be added
    const newMultiEvent = { ...multiMix };

    //Add sprayMix to multiMix
    newMultiEvent.sprays.push(newSprayMix);
    setMultiMix(newMultiEvent);

    //Reset sprayMix to intial state from context
    setSprayMix({ title: "", sprays: [], id: null });
  };

  const titleReset = () => {
    setSprayMixName("");
    localStorage.removeItem("title");
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Spray Mix</h1>

          <div
            className={`${standard.cardBackground} ${styles.sprayMixDisplay}`}
          >
            {sprayMix.sprays.length !== 0 && (
              <form className={styles.formDisplay}>
                {" "}
                <label htmlFor="sprayMixName" className={styles.formLabel}>
                  Mix Name:
                </label>
                {!sprayMixName ? (
                  <>
                    <input
                      className={styles.formName}
                      id="sprayMixName"
                      type="string"
                      required
                      value={capitalizeFirstLetter(name)}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button
                      onClick={handleSprayMixTitle}
                      className={styles.addBtn}
                    >
                      Add
                    </button>
                  </>
                ) : (
                  <div className={styles.sprayMixTitle}>
                    <p>{sprayMixName}</p>
                    <button onClick={titleReset} className={styles.editBtn}>
                      Edit
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* checks if the spray in the spray list  */}
            {sprayMix.sprays.length !== 0 ? (
              <>
                <ul className={styles.sprayList}>
                  {sprayMix.sprays.map((spray, index) => {
                    return (
                      <li key={index}>
                        <div className={styles.sprayDetails}>
                          <p>{spray.spray.sprayName.name}</p>
                          <p>
                            {spray.spray.rate} {spray.spray.unit} per{" "}
                            {spray.sprayArea > 1 ? (
                              <span>hectares</span>
                            ) : (
                              <span>hectare</span>
                            )}
                          </p>
                          <div className={styles.buttonGroup}>
                            <Link
                              href={`/makeSpray`}
                              onClick={() => resetData(index)}
                              className={styles.editBtn}
                            >
                              Edit
                            </Link>
                            <button
                              className={styles.deleteBut}
                              onClick={() => deleteSpray(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p>No spray mixes created</p>
            )}
            <Link href={`/makeSpray`} className={styles.editBtnSpray}>
              Add a spray mix
            </Link>
          </div>
          {error && (
            <p className={standard.error}>Please add a spray mix name</p>
          )}
          <div className={standard.styledNext}>
            <Link href={`/sprayRate`} className={standard.next}>
              Back
            </Link>

            {sprayMixName ? (
              <Link
                href={`/sprayDetails`}
                className={standard.next}
                onClick={() => addSprayMix()}
              >
                Done
              </Link>
            ) : (
              <button
                onClick={() => setError(true)}
                className={styles.doneButton}
              >
                {" "}
                Done
              </button>
            )}
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default SprayMixDisplay;
