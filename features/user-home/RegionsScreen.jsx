import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import AreaParent from "@/components/area_parent/AreaParent";
import AreaChildBg from "@/components/area_child/AreaChildBg";
import AreaChildCheck from "@/components/area_child/AreaChildCheck";
import AreaCheck from "@/components/area_check/AreaCheck";
import ChipArea from "@/components/chip/ChipArea";
import Button from "@/components/button";
import FieldSearch from "@/components/field/FieldSearch";
import { locationData, locationSearchResults } from "@/constants/matchingRegions";
import { toggleRegion } from "./state";
import Frame from "./Frame";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
export const regionOptions = ()=>{
 const options=new Map(locationSearchResults.map(item=>[item.id,item]));
 for(const province of locationData){options.set(province.id,{id:province.id,title:province.fullTitle,chipTitle:province.fullTitle});for(const district of province.districts){options.set(district.id,{id:district.id,title:`${province.title} ${district.title}`,chipTitle:district.chipTitle??district.title});for(const town of district.children??[])options.set(town.id,{...town,title:`${province.title} ${district.title} ${town.title}`,chipTitle:town.chipTitle??town.title});}}
 return [...options.values()];
};
export default function RegionsScreen({ initialQuery="", initialSelected, initialProvince=null }) {
 const {state,filterDraft,setFilterDraft,setNotice}=useDiscovery();const nav=useHomeNavigation();
 const [selected,setSelected]=useState(initialSelected??filterDraft?.regions??state.filters.regions);
 const [province,setProvince]=useState(initialProvince);const [district,setDistrict]=useState(null);const [query,setQuery]=useState(initialQuery);
 const parent=locationData.find(item=>item.id===province);const area=parent?.districts.find(item=>item.id===district);
 const options=regionOptions().filter(item=>item.title.includes(query.trim()));
 const toggle=item=>{if(selected.length>=5&&!selected.some(value=>value.id===item.id))setNotice("지역은 최대 5개까지 선택할 수 있어요.");else setSelected(toggleRegion(selected,item));};
 const check=item=><AreaChildCheck key={item.id} title={item.chipTitle??item.title} checked={selected.some(value=>value.id===item.id)} onChange={()=>toggle(item)} className="!w-full"/>;
 return <Frame title={query?"지역 검색하기":"지역 설정"} footer={<Button variant="fill" accessibilityRole="button" text="지역 적용하기" onPress={()=>{setFilterDraft({...filterDraft??state.filters,regions:selected});nav.goBack();}}/>}>
  <View className="px-4 py-4"><FieldSearch accessibilityLabel="지역 검색" placeholder="읍면동으로 검색" value={query} onChangeText={setQuery} className="!w-full"/></View>
  {query.trim()?<><Text className="px-4 pb-3 text-14 font-pretendard-semibold text-text">‘{query.trim()}’ 검색 결과 {options.length}건</Text><ScrollView className="flex-1">{options.map(item=><AreaCheck key={item.id} label={item.title} checked={selected.some(value=>value.id===item.id)} onPress={()=>toggle(item)} className="!rounded-none !bg-white !py-2"/>)}{!options.length&&<Text className="p-4 text-14 text-grayscale-G500">검색 결과가 없어요.</Text>}</ScrollView></>:<>
   <View className="h-9 flex-row bg-grayscale-G50">{["시・도","시・군・구","동・읍・면"].map((label,i)=><View key={label} className={i?"flex-1 items-center justify-center":"w-20 items-center justify-center"}><Text className="text-12 text-grayscale-G700">{label}</Text></View>)}</View>
   <View className="min-h-0 flex-1 flex-row"><ScrollView className="w-20 flex-grow-0 bg-grayscale-G50">{locationData.map(item=><AreaParent key={item.id} title={item.title} selected={province===item.id} onChange={()=>{setProvince(item.id);setDistrict(null);}} className="!w-full"/>)}</ScrollView>
    <ScrollView className="min-w-0 flex-1">{parent?.districts.length?parent.districts.map(item=>item.children?.length?<AreaChildBg key={item.id} title={item.title} selected={district===item.id} onChange={()=>setDistrict(item.id)} className="!w-full"/>:check({id:item.id,title:item.title,chipTitle:item.chipTitle})):parent?check({id:parent.id,title:parent.fullTitle}):null}</ScrollView>
    <ScrollView className="min-w-0 flex-1">{area?.children?.map(check)}</ScrollView>
   </View>
  </>}
  {!!selected.length&&<View className="gap-3 border-t border-grayscale-G100 px-4 py-3"><Text className="text-12 text-grayscale-G600">선택한 지역 <Text className="text-primary-main">{selected.length}/5</Text></Text><View className="flex-row flex-wrap gap-2">{selected.map(item=><ChipArea key={item.id} text={item.chipTitle??item.title} onClose={()=>setSelected(selected.filter(value=>value.id!==item.id))}/>)}</View></View>}
 </Frame>;
}
