import { createContext, useState } from "react";

const SprayContext = createContext();

export function SprayProvider({ children }) {
  const initialState = {
    paddockId: null,
    paddock: "",
    cropId: null,
    crop: "",
    date: "",
    sprayMix: [],
    // sprayMix: {
    //   sprayMixId: null,
    //   title: "",
    //   sprays: [],
    // sprays: [{ sprayId: null, sprayName: "", rate: 0.0, unit: "" }],
    //},
  };

  const mixInitial = {
    sprays: [],
    // {
    //   title: "",
    //   sprayMixId: null,
    //   sprays: [{ sprayId: null, sprayName: "", rate: 0.0, unit: "" }],
    // },
  };

  const companyIdInit = null;
  const [sprayEvent, setSprayEvent] = useState(initialState);
  const [sprayMix, setSprayMix] = useState(mixInitial);
  const [companyId, setCompanyId] = useState(companyIdInit);
  return (
    <SprayContext.Provider
      value={{
        event: [sprayEvent, setSprayEvent],
        mix: [sprayMix, setSprayMix],
        company: [companyId, setCompanyId],
      }}
    >
      {children}
    </SprayContext.Provider>
  );
}

export default SprayContext;
