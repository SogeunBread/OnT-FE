import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProfileReviews from "@/components/trainer-profile/ProfileReviews";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { first } from "./navigation";
import Frame, { Empty } from "./Frame";
export default function ReviewsScreen({ trainerId }) {
 const params=useLocalSearchParams();const {trainers}=useDiscovery();const nav=useHomeNavigation();
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const profile=trainers.find(item=>item.id===(trainerId??first(params.id)));
 if(!mounted)return <View className="flex-1 bg-white"/>;
 return profile?<ProfileReviews reviews={profile.reviews} totalCount={profile.reviewCount} onBack={nav.goBack}/>:<Frame title="리뷰"><Empty text="트레이너를 찾을 수 없어요." onPress={nav.goBack}/></Frame>;
}
