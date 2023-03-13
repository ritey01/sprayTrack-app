import React, { useContext } from "react";
import standard from "../styles/Standard.module.css";
import styles from "../styles/SprayDetails.module.css";
import Link from "next/link";
import SprayContext from "../context/sprayEvent";

const SprayDetails = () => {
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;

  const validateState = (state) => {
    const emptyFields = [];
    const fieldsToCheck = ["date", "paddock", "crop", "sprayMix"];
    fieldsToCheck.forEach((field) => {
      const value = state[field];
      if (!value || (Array.isArray(value) && !value.length)) {
        emptyFields.push(field);
      }
    });
    if (emptyFields.length) {
      return `The following fields are empty or null: ${emptyFields.join(
        ", "
      )}`;
    } else {
      return true;
    }
  };

  const submitSpray = async (sprayEvent) => {
    const fieldCheck = validateState(sprayEvent);

    if (!fieldCheck) {
      setEmptyFields([]);
    }

    const body = { sprayEvent };
    const result = await fetch(`/api/spray/postSprayEvent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log("✅", result);
  };

  return (
    <div className={`${standard.cardBackground} ${styles.detailsCard}`}>
      <p className={styles.labels}> Date</p>

      <p className={styles.sprayDetails}>
        {/* Checks if date else returns message */}
        {sprayEvent.date ? sprayEvent.date : "No date entered"}
        <Link href={`/date`} className={styles.editBtn}>
          Edit
        </Link>
      </p>

      <p className={styles.labels}> Paddock</p>
      <p className={styles.sprayDetails}>
        {/* Checks if a paddock entered else returns a message */}
        {sprayEvent.paddock ? sprayEvent.paddock : "No paddock entered"}
        <Link href={`/paddock`} className={styles.editBtn}>
          Edit
        </Link>
      </p>

      <p className={styles.labels}> Crop</p>
      <p className={styles.sprayDetails}>
        {/* Checks if a crop entered else returns a message */}
        {sprayEvent.crop ? sprayEvent.crop : "No crop entered"}
        <Link href={`/crop`} className={styles.editBtn}>
          Edit
        </Link>
      </p>

      <p className={styles.labels}>Spray</p>
      <div className={styles.sprayMixCard}>
        <div className={styles.sprayTitleDisplay}>
          <p>{sprayEvent.sprayMix.title}</p>
          <Link href={`/spray`} className={styles.editBtn}>
            Edit
          </Link>
        </div>

        {/* Checks if a spray is entered else returns a message */}

        {sprayEvent.sprayMix.sprays.length == 0
          ? "No spray entered"
          : sprayEvent.sprayMix.sprays.map((spray) => {
              return (
                <>
                  <div className={styles.sprayType}>
                    <p className={styles.sprayName}>{spray.sprayName}</p>

                    <p>
                      {spray.rate} {spray.unit} per hectares
                    </p>
                    <div className={styles.line}></div>
                  </div>
                </>
              );
            })}
      </div>
      <div className={standard.styledNext}>
        <Link href={`/spray`} className={standard.next}>
          Back
        </Link>
        <button onClick={() => submitSpray(sprayEvent)}>Submit</button>
        {/* <Link href={`/paddock`} className={standard.next}>
          Start again
        </Link> */}
      </div>
    </div>
  );
};
export default SprayDetails;
