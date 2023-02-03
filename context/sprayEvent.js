import { createContext, useState } from "react";

const SprayContext = createContext();

export function SprayProvider({ children }) {
  const initialState = {
    paddock: "",
    crop: "",
    date: "",
    sprayMix: { name: "", mixs: [] },
  };

  const mixInitial = {
    name: "",
    sprays: [{ spray: "", rate: "", unit: "" }],
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
