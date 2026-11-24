import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Avatar from "@/assets/figma/profile-avatar.svg";
import Plus from "@/assets/figma/home-compare-plus.svg";
import Delete from "@/assets/figma/home-compare-delete.svg";
import Verified from "@/assets/figma/verified.svg";
import Rating from "@/assets/figma/rating.svg";
import Arrow from "@/assets/figma/profile-review-right.svg";
import Tag from "@/components/tag";
import Frame from "./Frame";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { homeRoutes,trainerRoute,reviewsRoute } from "./navigation";
import useTrainerContact from "./useTrainerContact";
function Cell({children,height,label=false}) {return <View className={`items-center justify-center border-b border-r border-grayscale-G50 px-1 ${label?"bg-grayscale-G50/50":""}`} style={{height}}>{children}</View>;}
const BodyText=({children})=><Text className="text-center text-12 font-pretendard-medium text-text">{children}</Text>;
export default function CompareScreen() {
 const {state,send,trainers}=useDiscovery();const nav=useHomeNavigation();const contact=useTrainerContact();const {width}=useWindowDimensions();
 const selected=state.compared.map(id=>trainers.find(item=>item.id===id)).filter(Boolean);
 const rows=["전문 분야","평점","1회당 가격","경력","자격증",""];
 const tagHeight=Math.max(64,...selected.map(item=>item.specialties.length*32+24));
 const heights=[tagHeight,38,38,38,38,51];
 return <Frame title="트레이너 비교"><ScrollView><ScrollView horizontal showsHorizontalScrollIndicator>
  <View className="flex-row" style={{width:Math.max(width,390)}}>
   <View className="w-[81px]"><Cell height={182} label/>{rows.map((label,i)=><Cell key={label||"bottom"} height={heights[i]} label><Text className="text-12 font-pretendard-medium text-grayscale-G600">{label}</Text></Cell>)}</View>
   {Array.from({length:3},(_,i)=>{const trainer=selected[i];return <View key={trainer?.id??`empty-${i}`} className="min-w-0 flex-1">
    <Cell height={182}>{trainer?<View className="w-full gap-3 px-3"><Pressable accessibilityRole="button" accessibilityLabel={`${trainer.name} 비교함에서 제거`} hitSlop={8} onPress={()=>send({type:"remove",id:trainer.id})} className="h-4 w-4 self-end items-center justify-center rounded-full bg-grayscale-G100"><Delete/></Pressable><View className="items-center gap-3">{trainer.avatarSource?<Image source={typeof trainer.avatarSource==="string"?{uri:trainer.avatarSource}:trainer.avatarSource} className="h-[60px] w-[60px] rounded-full"/>:<Avatar/>}<View className="flex-row items-center"><Text numberOfLines={1} className="shrink text-16 font-pretendard-semibold text-text">{trainer.name}</Text>{trainer.verified&&<Verified/>}</View></View><Pressable accessibilityRole="button" accessibilityLabel={`${trainer.name} 채팅 문의`} onPress={()=>contact(trainer)} className="items-center rounded-lg bg-primary-main py-1.5"><Text className="text-14 text-white">채팅 문의</Text></Pressable></View>:<Pressable accessibilityRole="button" accessibilityLabel={`비교함 ${i+1}번에 트레이너 추가`} onPress={()=>nav.push(homeRoutes.list)} className="items-center gap-3 px-2"><View className="h-11 w-11 items-center justify-center rounded-full bg-grayscale-G50"><Plus/></View><Text className="text-14 font-pretendard-semibold text-text">추가하기</Text><Text className="text-center text-12 text-grayscale-G300">한 번에 비교할 수 있어요.</Text></Pressable>}</Cell>
    <Cell height={tagHeight}>{trainer?<View className="items-center gap-1">{trainer.specialties.length?trainer.specialties.map(tag=><Tag key={tag} text={tag} variant="filled" className="!self-center !px-2 !py-1.5" textClassName="!text-[10px] !leading-[15px]"/>):<BodyText>-</BodyText>}</View>:<BodyText>-</BodyText>}</Cell>
    <Cell height={38}>{trainer?<Pressable accessibilityRole="button" accessibilityLabel={`${trainer.name} 리뷰 보기`} onPress={()=>nav.push(reviewsRoute(trainer.id))} className="flex-row items-center gap-0.5"><Rating/><Text className="text-[10px] text-text">{trainer.rating.toFixed(1)} ({trainer.reviewCount})</Text><Arrow/></Pressable>:<BodyText>-</BodyText>}</Cell>
    {[trainer?.comparisonPrice!=null?`${trainer.comparisonPrice.toLocaleString("ko-KR")}원`:"-",trainer?.careerLabel??"-",trainer?`${trainer.certificateCount}개`:"-"].map((value,j)=><Cell key={j} height={38}><BodyText>{value}</BodyText></Cell>)}
    <Cell height={51}>{trainer?<Pressable accessibilityRole="button" accessibilityLabel={`${trainer.name} 상세보기`} onPress={()=>nav.push(trainerRoute(trainer.id))} className="flex-row items-center gap-1 rounded-full bg-grayscale-G50 px-2 py-1"><BodyText>상세보기</BodyText><Arrow/></Pressable>:<BodyText>-</BodyText>}</Cell>
   </View>;})}
  </View>
 </ScrollView></ScrollView></Frame>;
}
