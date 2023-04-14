import React, { useState, useContext } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "../styles/SprayMixDisplay.module.css";
import standard from "../styles/Standard.module.css";
import SprayContext from "../context/sprayEvent";
import AccessDenied from "../components/accessDenied";

const SprayMixDisplay = () => {
  const [sprayMixName, setSprayMixName] = useState("");
  const { event, mix } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  const [sprayMix, setSprayMix] = mix;
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

  const addSprayMix = async () => {
    const newSprayMix = { ...sprayMix };
    newSprayMix.title = sprayMixName;
    const newSprayEvent = { ...sprayEvent };
    newSprayEvent.sprayMix = newSprayMix;
    setSprayEvent(newSprayEvent);

    //saves the created spraymix for later use
    const body = { title: sprayMixName, sprays: sprayMix.sprays };
    const result = await fetch(`/api/spray/postSprayList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Spray Mix</h1>
          <div
            className={`${standard.cardBackground} ${styles.sprayMixDisplay}`}
          >
            {sprayMix.sprays.length == 0 && (
              <p className={styles.noSprayMessage}>No spray entered</p>
            )}

            {sprayMix.sprays.length > 0 && (
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
            )}

            {sprayMix.sprays.map((spray, index) => {
              return (
                <>
                  <div className={styles.sprayDetails}>
                    <p>{spray.sprayName}</p>
                    <p>
                      {spray.rate} {spray.unit} per{" "}
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
                </>
              );
            })}
            {sprayMix.sprays.length > 0 && (
              <Link href={`/makeSpray`} className={styles.editBtn}>
                Add another spray
              </Link>
            )}
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
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default SprayMixDisplay;
