import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import AccountProfileEditor from "@/features/trainer-settings/AccountProfileEditor";
import { useTrainerSettings } from "@/features/trainer-settings/TrainerSettingsProvider";
import { normalizeAccount, releaseAccountPhoto, validateAccount } from "@/features/trainer-settings/account";

export default function TrainerAccountSettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { account, saveAccount } = useTrainerSettings();
  const [draft, setDraft] = useState(() => ({ ...account }));
  const [error, setError] = useState("");
  const draftRef = useRef(draft);
  const originalPhoto = useRef(account.avatarSource);
  const saved = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const pendingAction = useRef(null);
  draftRef.current = draft;
  useEffect(() => () => {
    if (!saved.current && draftRef.current.avatarSource !== originalPhoto.current) releaseAccountPhoto(draftRef.current.avatarSource);
  }, []);
  const finish = (action) => {
    const message = validateAccount(draftRef.current);
    if (message) { setError(message); return; }
    Keyboard.dismiss();
    saved.current = true;
    saveAccount(normalizeAccount(draftRef.current));
    pendingAction.current = action;
    setLeaving(true);
  };
  usePreventRemove(!leaving, ({ data }) => finish(data.action));
  useEffect(() => {
    if (!leaving) return;
    if (pendingAction.current) navigation.dispatch(pendingAction.current);
    else router.dismissTo("/(trainerTabs)/mypage");
  }, [leaving]);
  const change = (key, value) => {
    if (key === "avatarSource" && draft.avatarSource !== originalPhoto.current) releaseAccountPhoto(draft.avatarSource);
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const goBack = () => finish(null);
  return <AccountProfileEditor value={draft} onChange={change} error={error} onBack={goBack} />;
}
