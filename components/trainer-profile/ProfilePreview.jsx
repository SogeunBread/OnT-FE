import HeaderMain from "@/components/header_main";
import { trainerProfileExample, trainerProfileInitial, trainerProfilePlaces, trainerProfileAddresses } from "@/constants/trainerProfile";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import ProfileEditor, { releaseProfilePhoto } from "./ProfileEditor";
import ProfileView from "./ProfileView";
import ProfileReviews from "./ProfileReviews";
import LocationEditor from "./LocationEditor";

const scenarios = [
  ["1994:18956", "프로필 초기", "profile"],
  ["1976:16753", "프로필 수정 초기", "edit"],
  ["1976:17950", "전문 분야 · 선택 전", "specialty"],
  ["1976:18382", "전문 분야 · 5개 선택", "specialty-full"],
  ["1976:18510", "전문 분야 적용", "selected"],
  ["2299:34088", "수업 위치 · 검색 전", "location"],
  ["2299:34394", "수업 위치 · 검색 결과", "location-results"],
  ["2299:35101", "수업 위치 · 선택", "location-selected"],
  ["2299:35164", "수업 위치 · 직접 입력", "location-manual"],
  ["2299:35323", "수업 위치 · 주소 입력", "location-address"],
  ["1976:18623", "가격 항목", "price"],
  ["1994:19195", "경력 항목", "career"],
  ["1995:19337", "자격증 항목", "certificate"],
  ["1976:18789", "추가 항목 적용", "populated"],
  ["2000:19491", "프로필 사진 변경", "photo"],
  ["2001:19639", "프로필 완성", "complete"],
  ["2051:19471", "리뷰 목록", "reviews"],
];

function PreviewFlow({ scenario, onClose }) {
  const example = ["populated", "photo", "complete", "reviews"].includes(scenario);
  const [profile, setProfile] = useState(example ? trainerProfileExample : ["selected", "specialty-full"].includes(scenario) ? { ...trainerProfileInitial, specialties: trainerProfileExample.specialties } : trainerProfileInitial);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  useEffect(() => () => releaseProfilePhoto(profileRef.current.avatarSource), []);
  const saveProfile = (next) => {
    if (profile.avatarSource !== next.avatarSource) releaseProfilePhoto(profile.avatarSource);
    setProfile(next);
  };
  const [screen, setScreen] = useState(scenario === "complete" || scenario === "profile" ? "profile" : scenario === "reviews" ? "reviews" : "edit");
  const [locationOpen, setLocationOpen] = useState(scenario.startsWith("location"));
  const [message, setMessage] = useState("");
  if (locationOpen) return <LocationEditor
    places={trainerProfilePlaces} addressOptions={trainerProfileAddresses}
    initialMode={scenario === "location-manual" || scenario === "location-address" ? "manual" : "search"}
    initialQuery={scenario === "location-results" || scenario === "location-selected" ? "다짐" : ""}
    initialSelectionId={scenario === "location-selected" ? "unjeong" : undefined}
    value={scenario === "location-address" ? { name: "다짐 피트니스 오류동역점", address: "서울특별시 구로구 오류동 123-45", detailAddress: "" } : null}
    onBack={onClose} onSave={(location) => { setProfile((current) => ({ ...current, location })); setLocationOpen(false); }} />;
  if (screen === "reviews") return <ProfileReviews reviews={profile.reviews} totalCount={profile.reviewCount} onBack={() => setScreen("profile")} />;
  if (screen === "edit") return <ProfileEditor value={profile} places={trainerProfilePlaces} addressOptions={trainerProfileAddresses} onBack={() => setScreen("profile")}
    initialSheet={["specialty", "specialty-full"].includes(scenario) ? "specialty" : ["price", "career", "certificate"].includes(scenario) ? scenario : null}
    onSave={(next) => { saveProfile(next); setScreen("profile"); }} />;
  return <View className="flex-1 bg-white"><HeaderMain menuName="트레이너 프로필" /><ProfileView profile={profile} onEdit={() => setScreen("edit")} onReviews={() => setScreen("reviews")} onPressMap={() => setMessage("지도 연결 콜백 호출")} />{message ? <Text className="p-3 text-12 text-primary-main">{message}</Text> : null}</View>;
}

export default function ProfilePreview() {
  const [scenario, setScenario] = useState(null);
  return (
    <View className="gap-2">
      <Text className="text-12 font-pretendard-regular text-grayscale-G600">17개 Figma 상태 · 로컬 예시 데이터 · 사진은 기기에서 선택</Text>
      {scenarios.map(([id, label, state]) => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`미리보기 ${label}`} onPress={() => setScenario(state)} className="rounded-lg bg-white px-3 py-2.5"><Text className="text-14 font-pretendard-medium text-text">{label}</Text><Text className="text-12 font-pretendard-regular text-grayscale-G500">{id}</Text></Pressable>)}
      <Modal visible={scenario !== null} animationType="slide" onRequestClose={() => setScenario(null)}>
        <View className="flex-1 bg-white">
          <Pressable accessibilityRole="button" accessibilityLabel="프로필 미리보기 닫기" className="border-b border-grayscale-G100 px-4 py-2" onPress={() => setScenario(null)}><Text className="text-12 font-pretendard-semibold text-primary-main">미리보기 닫기</Text></Pressable>
          {scenario ? <PreviewFlow key={scenario} scenario={scenario} onClose={() => setScenario(null)} /> : null}
        </View>
      </Modal>
    </View>
  );
}
