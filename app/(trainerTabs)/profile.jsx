import ProfileView from "@/components/trainer-profile/ProfileView";
import { useTrainerProfile } from "@/components/trainer-profile/TrainerProfileContext";
import { useRouter } from "expo-router";
import { Linking } from "react-native";

export default function ProfileTab() {
  const router = useRouter();
  const { profile } = useTrainerProfile();
  return (
    <ProfileView profile={profile}
      onEdit={() => router.push("/(trainer)/profile-edit")}
      onReviews={() => router.push("/(trainer)/profile-reviews")}
      onPressMap={(location) => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location.name, location.address].join(" "))}`)} />
  );
}

