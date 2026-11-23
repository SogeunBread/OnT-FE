import ProfileReviews from "@/components/trainer-profile/ProfileReviews";
import { useTrainerProfile } from "@/components/trainer-profile/TrainerProfileContext";
import { useRouter } from "expo-router";

export default function TrainerProfileReviewsScreen() {
  const router = useRouter();
  const { profile } = useTrainerProfile();
  return <ProfileReviews reviews={profile.reviews} totalCount={profile.reviewCount} onBack={() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(trainerTabs)/profile");
  }} />;
}
