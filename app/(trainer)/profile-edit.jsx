import ProfileEditor from "@/components/trainer-profile/ProfileEditor";
import { useTrainerProfile } from "@/components/trainer-profile/TrainerProfileContext";
import { trainerProfileAddresses, trainerProfilePlaces } from "@/constants/trainerProfile";
import { useRouter } from "expo-router";

export default function TrainerProfileEditScreen() {
  const router = useRouter();
  const { profile, saveProfile } = useTrainerProfile();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(trainerTabs)/profile");
  };
  return <ProfileEditor value={profile} places={trainerProfilePlaces} addressOptions={trainerProfileAddresses}
    onBack={goBack} onSave={(next) => { saveProfile(next); goBack(); }} />;
}
