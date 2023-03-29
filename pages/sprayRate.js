import React, { useState, useContext } from "react";
import Link from "next/link";
import SprayContext from "../context/sprayEvent";
import styles from "../styles/SprayRate.module.css";
import standard from "../styles/Standard.module.css";

const SprayRate = () => {
  const [sprayAmount, setSprayAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [isActive, setIsActive] = useState();
  const { event, mix } = useContext(SprayContext);
  const [sprayMix, setSprayMix] = mix;
  const [sprayEvent, setSprayEvent] = event;

  const unitList = ["Litres", "Kgs", "mls", "grams"];

  const handleSubmit = () => {
    // e.preventDefault();

    //Adds the spray to the sprayEvent
    //Not sure if this is needed as can add after spraymix created?
    // const newSprayEvent = { ...sprayEvent };
    // const index = newSprayEvent.sprayMix.mixs.length - 1;
    // newSprayEvent.sprayMix.mixs[index].rate = sprayAmount;
    // newSprayEvent.sprayMix.mixs[index].unit = unit;
    // newSprayEvent.sprayMix.mixs[index].sprayArea = area;

    //setSprayEvent(newSprayEvent);

    //Adds rate and unit to sprayMix
    const newSprayMix = { ...sprayMix };
    const index = newSprayMix.sprays.length - 1;

    newSprayMix.sprays[index].rate = parseInt(sprayAmount);
    newSprayMix.sprays[index].unit = unit;
    setSprayMix(newSprayMix);
    console.log("🚀", sprayMix);
  };
  //Clears the last spray added to the sprayEvent
  const clearSpray = () => {
    const newSprayEvent = { ...sprayEvent };
    newSprayEvent.sprayMix.sprays.pop();
    setSprayEvent(newSprayEvent);
  };

  //Sets the unit value for the spray amount
  const handleUnitClick = (index) => {
    setUnit(unitList[index]);
    setIsActive(index);
  };

  return (
    <div>
      <h1 className={standard.title}>Spray Rate</h1>

      <div className={`${standard.cardBackground} ${styles.centerInput}`}>
        <form>
          <div className={styles.paddockName}>
            <label htmlFor="sprayAmount" className={styles.rateLabel}>
              Amount
            </label>
            <input
              className={styles.rateInput}
              aria-label="Amount"
              id="sprayAmount"
              type="number"
              required
              value={sprayAmount}
              onChange={(e) => setSprayAmount(parseInt(e.target.value))}
            />
          </div>
        </form>

        <ul className={styles.volumeBtnDisplay}>
          {unitList.map((unitL, index) => (
            <li key={index} className={styles.btnLayout} value={unit || ""}>
              <button
                style={{
                  backgroundColor:
                    isActive == index
                      ? "rgb(17, 138, 178)"
                      : "rgb(6, 214, 160)",
                }}
                className={styles.rateButtons}
                onClick={() => handleUnitClick(index)}
              >
                {unitL}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={standard.styledNext}>
        <Link
          href={`/makeSpray`}
          className={standard.next}
          // clears last spray added to the sprayEvent
          onClick={() => clearSpray()}
        >
          Back
        </Link>
        <Link
          href={`/sprayMixDisplay`}
          className={standard.next}
          onClick={() => handleSubmit()}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default SprayRate;
