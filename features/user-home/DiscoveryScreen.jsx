import { useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import TrainerList from "@/components/trainer_list";
import FieldSearch from "@/components/field/FieldSearch";
import ButtonIcon from "@/components/button_icon";
import FilterIcon from "@/assets/figma/home-filter.svg";
import Frame, { Empty } from "./Frame";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { homeRoutes, trainerRoute } from "./navigation";
import { filterTrainers, hasFilters } from "./state";
export default function DiscoveryScreen() {
 const {state,send,trainers,addCompare}=useDiscovery();
 const nav=useHomeNavigation();const scroll=useRef(null);const offset=useRef(state.scrollOffset);
 useEffect(()=>{offset.current=state.scrollOffset;scroll.current?.scrollTo({y:state.scrollOffset,animated:false});},[state.query,state.filters]);
 const rows=filterTrainers(trainers,state.query,state.filters);
 return <Frame title="트레이너 상세보기" actionType="compare" compareLabel="비교함" onPressCompare={()=>nav.push(homeRoutes.compare)}>
  <View className="flex-row items-center gap-2 px-4 py-4"><FieldSearch value={state.query} onChangeText={value=>send({type:"query",value})} accessibilityLabel="트레이너 이름 또는 헬스장 검색" placeholder="트레이너명, 헬스장 이름 검색" className="!w-auto min-w-0 flex-1"/>
   <View><ButtonIcon accessibilityLabel="트레이너 필터" icon={<FilterIcon/>} onPress={()=>nav.push(homeRoutes.filter)}/>{hasFilters(state.filters)&&<View pointerEvents="none" className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary-main"/>}</View>
  </View>
  {rows.length?<ScrollView ref={scroll} onLayout={()=>scroll.current?.scrollTo({y:offset.current,animated:false})} scrollEventThrottle={100} onScroll={e=>{offset.current=e.nativeEvent.contentOffset.y;}} onScrollEndDrag={()=>send({type:"scroll",value:offset.current})} onMomentumScrollEnd={()=>send({type:"scroll",value:offset.current})}>
   {rows.map(trainer=><TrainerList key={trainer.id} name={trainer.name} gym={trainer.location?.name} demographics={`${trainer.gender}・${trainer.age}세`} verified={trainer.verified} rating={trainer.rating.toFixed(1)} reviewCount={trainer.reviewCount.toLocaleString("ko-KR")} lessonCount={state.filters.count} price={Number(trainer.prices.find(price=>price.count===state.filters.count)?.price).toLocaleString("ko-KR")} tags={trainer.specialties} avatarSource={trainer.avatarSource} onPress={()=>{send({type:"scroll",value:offset.current});nav.push(trainerRoute(trainer.id));}} onPressCompare={()=>addCompare(trainer.id)} />)}
  </ScrollView>:<Empty text="조건에 맞는 트레이너가 없어요."/>}
 </Frame>;
}
