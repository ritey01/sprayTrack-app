import { createContext, useState } from "react";

const SprayContext = createContext();

export function SprayProvider({ children }) {
  const initialState = {
    paddock: "",
    crop: "",
    date: "",
    sprayMix: { name: "", mixs: [] },
  };
  const [sprayEvent, setSprayEvent] = useState(initialState);
  return (
    <SprayContext.Provider value={{ sprayEvent, setSprayEvent }}>
      {children}
    </SprayContext.Provider>
  );
}

export default SprayContext;
