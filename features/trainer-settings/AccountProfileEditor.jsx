import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import AccountProfileForm from "./AccountProfileForm";
import { releaseAccountPhoto } from "./account";
import PreparationNotice from "./PreparationNotice";

export default function AccountProfileEditor({ value, onChange, onBack, error }) {
  const [pickingPhoto, setPickingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [notice, setNotice] = useState("");
  const mounted = useRef(true);
  const picking = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const pickPhoto = async () => {
    if (picking.current) return;
    picking.current = true;
    setPickingPhoto(true);
    setPhotoError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 1, exif: false });
      if (result.canceled) return;
      const photo = result.assets?.[0];
      if (!mounted.current) { releaseAccountPhoto(photo); return; }
      if (!photo?.uri || photo.width <= 0 || photo.height <= 0) { releaseAccountPhoto(photo); setPhotoError("사진을 불러오지 못했어요. 다른 사진을 선택해주세요."); return; }
      onChange("avatarSource", { uri: photo.uri });
    } catch {
      if (mounted.current) setPhotoError("사진을 불러오지 못했어요. 다시 시도해주세요.");
    } finally {
      picking.current = false;
      if (mounted.current) setPickingPhoto(false);
    }
  };
  return (
    <>
      <AccountProfileForm value={value} onChange={onChange} onBack={onBack} onPickPhoto={pickPhoto} pickingPhoto={pickingPhoto} error={photoError || error} onLogout={() => setNotice("로그아웃")} onWithdraw={() => setNotice("회원탈퇴")} />
      <PreparationNotice title={notice} onClose={() => setNotice("")} />
    </>
  );
}
