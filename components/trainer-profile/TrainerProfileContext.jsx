import { createContext, useContext, useEffect, useRef, useState } from "react";
import { trainerProfileWithMockReviews } from "@/constants/trainerProfile";
import { releaseProfilePhoto } from "./ProfileEditor";

const TrainerProfileContext = createContext(null);

export function TrainerProfileProvider({ children, initialProfile = trainerProfileWithMockReviews }) {
  const [profile, setProfile] = useState(initialProfile);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  useEffect(() => () => releaseProfilePhoto(profileRef.current.avatarSource), []);
  const saveProfile = (next) => {
    if (profile.avatarSource !== next.avatarSource) releaseProfilePhoto(profile.avatarSource);
    setProfile(next);
  };
  return <TrainerProfileContext.Provider value={{ profile, saveProfile }}>{children}</TrainerProfileContext.Provider>;
}

export function useTrainerProfile() {
  const context = useContext(TrainerProfileContext);
  if (!context) throw new Error("TrainerProfileProvider가 필요합니다.");
  return context;
}
