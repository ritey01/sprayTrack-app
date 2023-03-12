import { createContext, useState } from "react";

const SprayContext = createContext();

export function SprayProvider({ children }) {
  const initialState = {
    paddockId: null,
    paddock: "",
    cropId: null,
    crop: "",
    date: "",
    //Think this needs to be
    sprayMix: {
      sprayMixId: null,
      title: "",
      sprays: [{ sprayId: null, sprayName: "", rate: 0, unit: "" }],
    },
  };

  const mixInitial = {
    name: "",
    sprays: [{ sprayId: null, sprayName: "", rate: 0, unit: "" }],
  };
  const [sprayEvent, setSprayEvent] = useState(initialState);
  const [sprayMix, setSprayMix] = useState(mixInitial);
  return (
    <SprayContext.Provider
      value={{
        event: [sprayEvent, setSprayEvent],
        mix: [sprayMix, setSprayMix],
      }}
    >
      {children}
    </SprayContext.Provider>
  );
}

export default SprayContext;
