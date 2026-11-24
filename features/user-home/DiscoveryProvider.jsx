import { createContext, useContext, useReducer, useState } from "react";
import { discoveryTrainers } from "@/constants/userHome";
import { discoveryReducer, initialDiscoveryState } from "./state";
const Context = createContext(null);
export default function DiscoveryProvider({ children, initialState = initialDiscoveryState, trainers = discoveryTrainers }) {
  const [state, send] = useReducer(discoveryReducer, initialState);
  const [filterDraft, setFilterDraft] = useState(null);
  const [notice, setNotice] = useState("");
  const addCompare = (id) => {
    if (!trainers.some((trainer) => trainer.id === id)) return;
    if (state.compared.includes(id)) return setNotice("이미 비교함에 담은 트레이너예요.");
    if (state.compared.length >= 3) return setNotice("최대 3명까지 비교할 수 있어요.");
    send({ type: "compare", id });
  };
  return <Context.Provider value={{ state, send, trainers, notice, setNotice, addCompare, filterDraft, setFilterDraft }}>{children}</Context.Provider>;
}
export function useDiscovery() { const value = useContext(Context); if (!value) throw new Error("DiscoveryProvider가 필요합니다."); return value; }
