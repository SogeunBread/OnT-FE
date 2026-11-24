import { trainerNotificationDefaults, trainerSettingsAccount } from "@/constants/trainerSettings";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { releaseAccountPhoto } from "./account";

const TrainerSettingsContext = createContext(null);

// Local account settings are independent from the public trainer profile and API authentication.
export default function TrainerSettingsProvider({ children, initialAccount = trainerSettingsAccount, initialNotifications = trainerNotificationDefaults }) {
  const [account, setAccount] = useState(() => ({ ...initialAccount }));
  const [notifications, setNotifications] = useState(() => ({ ...initialNotifications }));
  const accountRef = useRef(account);
  accountRef.current = account;
  useEffect(() => () => releaseAccountPhoto(accountRef.current.avatarSource), []);
  const saveAccount = (next) => {
    if (accountRef.current.avatarSource !== next.avatarSource) releaseAccountPhoto(accountRef.current.avatarSource);
    accountRef.current = next;
    setAccount(next);
  };

  const changeNotification = (key, value) => {
    setNotifications((current) => {
      if (!Object.hasOwn(current, key) || (key !== "push" && !current.push)) return current;
      return { ...current, [key]: Boolean(value) };
    });
  };

  return (
    <TrainerSettingsContext.Provider value={{ account, saveAccount, notifications, changeNotification }}>
      {children}
    </TrainerSettingsContext.Provider>
  );
}

export function useTrainerSettings() {
  const context = useContext(TrainerSettingsContext);
  if (!context) throw new Error("TrainerSettingsProvider가 필요합니다.");
  return context;
}
