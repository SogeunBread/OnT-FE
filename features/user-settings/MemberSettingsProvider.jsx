import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { createMemberSettingsSeed, memberReviewPolicy } from "@/constants/userSettings";
import { releaseAccountPhoto } from "@/components/settings/account";
import { settingsReducer } from "./state";
const Context = createContext(null);
export default function MemberSettingsProvider({ children, initialSeed, policy = memberReviewPolicy }) {
  const [state, dispatch] = useReducer(settingsReducer, initialSeed, seed => seed ?? createMemberSettingsSeed());
  const current = useRef(state); current.current = state;
  const send = (action) => { const next = settingsReducer(current.current, action); const changed = next !== current.current; current.current = next; dispatch(action); return changed; };
  useEffect(() => () => releaseAccountPhoto(current.current.account.avatarSource), []);
  const saveAccount = (value) => { if (current.current.account.avatarSource !== value.avatarSource) releaseAccountPhoto(current.current.account.avatarSource); send({ type: "account", value }); };
  const saveReview = (value) => send({ ...value, type: "save-review", policy, now: Date.now() });
  return <Context.Provider value={{ state, policy, send, saveAccount, saveReview }}>{children}</Context.Provider>;
}
export function useMemberSettings() { const value = useContext(Context); if (!value) throw new Error("MemberSettingsProvider가 필요합니다."); return value; }
