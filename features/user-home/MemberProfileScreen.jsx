import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Avatar from "@/assets/figma/profile-avatar-edit.svg";
import Verified from "@/assets/figma/verified.svg";
import Rating from "@/assets/figma/rating.svg";
import Arrow from "@/assets/figma/profile-review-right.svg";
import HeartIcon from "@/assets/figma/heart.svg";
import Heart from "@/components/heart/Heart";
import Button from "@/components/button";
import Tag from "@/components/tag";
import { ProfileSections } from "@/components/trainer-profile/ProfileView";
import Frame, { Empty } from "./Frame";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { first, reviewsRoute } from "./navigation";
import useTrainerContact from "./useTrainerContact";
export default function MemberProfileScreen({ trainerId, profileOverride }) {
 const params=useLocalSearchParams();const id=trainerId??first(params.id);
 const {state,send,trainers,addCompare}=useDiscovery();const nav=useHomeNavigation();const contact=useTrainerContact();
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const profile=profileOverride??trainers.find(item=>item.id===id);
 if(!mounted)return <View className="flex-1 bg-white"/>;
 if(!profile)return <Frame title="트레이너"><Empty text="트레이너를 찾을 수 없어요." onPress={nav.goBack}/></Frame>;
 const hasDetails=!!(profile.introduction||profile.location||profile.prices.length||profile.careers.length||profile.certificates.length);
 return <Frame title="" actionType="compare" compareLabel="비교함 담기" onPressCompare={()=>addCompare(profile.id)}
  footer={<View className="flex-row items-center gap-2"><View className="h-11 w-11 items-center justify-center rounded-lg border border-grayscale-G300"><Heart inactiveIcon={HeartIcon} liked={state.liked.includes(profile.id)} onChange={()=>send({type:"like",id:profile.id})} accessibilityLabel="트레이너 좋아요"/></View><Button variant="fill" className="flex-1" accessibilityRole="button" text="수업 요청 보내기" onPress={()=>contact(profile,true)}/></View>}>
  <ScrollView contentContainerStyle={{paddingBottom:16}}>
   <View className="gap-4 border-b-8 border-grayscale-G50 p-4">
    <View className="gap-3">{profile.avatarSource?<Image source={typeof profile.avatarSource==="string"?{uri:profile.avatarSource}:profile.avatarSource} className="h-[100px] w-[100px] rounded-full"/>:<Avatar/>}
     <View className="gap-0.5"><View className="flex-row flex-wrap items-center gap-1"><Text className="text-18 font-pretendard-bold text-text">{profile.name} 트레이너</Text>{profile.verified&&<Verified/>}</View><Text className="text-12 font-pretendard-medium text-grayscale-G500">{profile.gender}・{profile.age}세</Text>
      {!!profile.reviewCount&&<Pressable accessibilityRole="button" accessibilityLabel="트레이너 리뷰 보기" onPress={()=>nav.push(reviewsRoute(profile.id))} className="flex-row items-center gap-1 self-start"><Rating/><Text className="text-12 font-pretendard-semibold text-text">{profile.rating.toFixed(1)} <Text className="font-pretendard-regular text-grayscale-G500">({profile.reviewCount})</Text></Text><Arrow/></Pressable>}
     </View>
    </View>
    {!!profile.specialties.length&&<View className="flex-row flex-wrap gap-1.5">{profile.specialties.map(tag=><Tag key={tag} text={tag}/>)}</View>}
    {!!profile.introduction&&<Text className="text-14 font-pretendard-regular text-text">{profile.introduction}</Text>}
   </View>
   {hasDetails&&<ProfileSections profile={profile} includeIntroduction={false} locationLeading={<View className="h-12 w-12 rounded-md bg-grayscale-G100"/>}/>}
  </ScrollView>
 </Frame>;
}
