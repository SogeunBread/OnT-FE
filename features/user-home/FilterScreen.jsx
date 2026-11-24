import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Chip from "@/components/chip/Chip";
import Button from "@/components/button";
import Arrow from "@/assets/figma/home-record-right.svg";
import { homePurposes } from "@/constants/userHome";
import PriceRange from "./PriceRange";
import Frame from "./Frame";
import { COUNTS, defaultFilters, priceLimits } from "./state";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { homeRoutes } from "./navigation";
const clone=value=>JSON.parse(JSON.stringify(value));
export default function FilterScreen() {
 const {state,send,filterDraft,setFilterDraft}=useDiscovery();const nav=useHomeNavigation();
 useEffect(()=>{setFilterDraft(current=>current??clone(state.filters));},[]);
 const draft=filterDraft??state.filters;
 const update=patch=>setFilterDraft({...draft,...patch});
 const cancel=()=>{setFilterDraft(null);nav.goBack();};
 return <Frame title="필터" actionType="button" buttonLabel="초기화" onPressAction={()=>setFilterDraft(defaultFilters())} onPressBack={cancel}
  footer={<Button variant="fill" accessibilityRole="button" text="필터 적용하기" onPress={()=>{send({type:"filters",value:draft});setFilterDraft(null);nav.goBack();}}/>}>
  <ScrollView contentContainerStyle={{paddingBottom:24}}>
   <View className="gap-3 border-b border-grayscale-G50 p-4"><Text className="text-16 font-pretendard-semibold text-text">PT 횟수</Text><View className="flex-row gap-1.5">{COUNTS.map(count=><Chip key={count} text={`${count}회`} selected={draft.count===count} onPress={()=>{const limits=priceLimits(count);update({count,min:limits.min,max:limits.max});}} className="min-w-0 flex-1 !px-0"/>)}</View></View>
   <View className="gap-4 border-b border-grayscale-G50 px-4 py-4"><View className="gap-1"><View className="flex-row items-center justify-between"><Text className="text-16 font-pretendard-semibold text-text">가격 범위</Text><Text className="text-14 text-grayscale-G500">{draft.count}회 기준</Text></View><Text className="text-16 font-pretendard-semibold text-primary-main">{draft.min.toLocaleString("ko-KR")}원~{draft.max.toLocaleString("ko-KR")}원</Text></View><PriceRange value={draft} onChange={setFilterDraft}/></View>
   <View className="gap-3 border-b border-grayscale-G50 p-4"><View className="flex-row justify-between"><Text className="text-16 font-pretendard-semibold text-text">수업 장소</Text><Pressable accessibilityRole="button" accessibilityLabel="수업 장소 편집" className="flex-row items-center gap-1" onPress={()=>nav.push(homeRoutes.regions)}><Text className="text-14 text-grayscale-G700">편집</Text><Arrow/></Pressable></View><Text className="text-14 text-grayscale-G700">{draft.regions.map(item=>item.chipTitle??item.title).join(", ")||"전체 지역"}</Text></View>
   <View className="gap-3 p-4"><Text className="text-16 font-pretendard-semibold text-text">수업 목적</Text><View className="flex-row flex-wrap gap-1.5">{homePurposes.map(purpose=><Pressable key={purpose} accessibilityRole="checkbox" accessibilityState={{checked:draft.purposes.includes(purpose)}} onPress={()=>update({purposes:draft.purposes.includes(purpose)?draft.purposes.filter(item=>item!==purpose):[...draft.purposes,purpose]})} className={`rounded border px-2.5 py-1 ${draft.purposes.includes(purpose)?"border-primary-main bg-primary-main":"border-grayscale-G100 bg-white"}`}><Text className={`text-14 ${draft.purposes.includes(purpose)?"text-white":"text-grayscale-G600"}`}>{purpose}</Text></Pressable>)}</View></View>
  </ScrollView>
 </Frame>;
}
