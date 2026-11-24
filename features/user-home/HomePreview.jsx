import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaInsetsContext, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";
import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { userTabs } from "@/constants/userTabs";
import { discoveryTrainers, homeScenarios, memberProfileExample, memberProfileEmpty } from "@/constants/userHome";
import { locationSearchResults } from "@/constants/matchingRegions";
import { createExerciseSeed } from "@/features/exercise/mockData";
import ExerciseDetailSheet from "@/components/exercise/ExerciseDetailSheet";
import MealRecordDetailSheet from "@/components/meal-record/MealRecordDetailSheet";
import { createFeedbackMealSample,createWaitingMealSample,createNotRequestedMealSample } from "@/components/meal-record/meal-feedback-sample";
import UserTrainerProvider,{useUserTrainer,userMessageStamp} from "@/features/user-trainer/UserTrainerProvider";
import UserChatRoom from "@/features/user-trainer/UserChatRoom";
import TrainerMatching from "@/app/(userTabs)/trainer-matching";
import DiscoveryProvider,{useDiscovery} from "./DiscoveryProvider";
import { initialDiscoveryState, defaultFilters } from "./state";
import { HomeView } from "./HomeScreen";
import { HomeNavigationContext } from "./FlowNavigation";
import { homeRoutes,roomRoute } from "./navigation";
import DiscoveryScreen from "./DiscoveryScreen";
import FilterScreen from "./FilterScreen";
import RegionsScreen from "./RegionsScreen";
import MemberProfileScreen from "./MemberProfileScreen";
import ReviewsScreen from "./ReviewsScreen";
import CompareScreen from "./CompareScreen";
import HomeMatchingScreen from "./HomeMatchingScreen";
const routes={list:homeRoutes.list,search:homeRoutes.list,applied:homeRoutes.list,filter:homeRoutes.filter,range:homeRoutes.filter,regions:homeRoutes.regions,"regions-selected":homeRoutes.regions,"region-search":homeRoutes.regions,profile:"profile","profile-empty":"profile-empty",reviews:"reviews"};
function PreviewFlow({scenario,onClose}) {
 const {state:discovery,setNotice}=useDiscovery();
 const [history,setHistory]=useState([{pathname:routes[scenario]??(scenario.startsWith("compare")?homeRoutes.compare:homeRoutes.home)}]);
 const [date,setDate]=useState(scenario==="home-empty"?"2026-04-14":"2026-04-13");const [detail,setDetail]=useState(null);
 const nav={push:route=>setHistory(value=>[...value,typeof route==="string"?{pathname:route}:route]),replace:route=>setHistory(value=>[...value.slice(0,-1),typeof route==="string"?{pathname:route}:route]),back:()=>history.length>1?setHistory(value=>value.slice(0,-1)):onClose(),canGoBack:()=>true};
 nav.dismissTo=nav.replace;
 const route=history.at(-1);const path=route.pathname;const id=route.params?.id??"jaemin";
 const profile=path==="profile-empty"?memberProfileEmpty:memberProfileExample;
 const seed=createExerciseSeed(new Date(2026,3,13));
 const sessions=[{...seed.sessions[0],date:"2026-04-13",trainerName:"홍길동 트레이너",sessionNumber:4,totalSessions:10,location:"다짐 헬스장",records:Array.from({length:6},(_,i)=>({...seed.sessions[0].records[0],id:`preview-record-${i}`}))}];
 const meals=[createFeedbackMealSample(),createWaitingMealSample(),createNotRequestedMealSample()].map((meal,i)=>({...meal,id:`home-preview-${i}`,date:"2026-04-13",time:"11:30",photos:i===1?[]:meal.photos.slice(0,1)}));
 let content;
 if(path===homeRoutes.home)content=<View className="flex-1"><HeaderMain isHome/>
  <HomeView date={date} onDate={value=>setDate(format(value,"yyyy-MM-dd"))} events={[{date:"2026-04-13",type:"exercise"},{date:"2026-04-13",type:"meal"},{date:"2026-04-12",type:"meal"}]} journals={[]} sessions={scenario==="home"&&date==="2026-04-13"?sessions:[]} meals={scenario==="home"&&date==="2026-04-13"?meals:[]} matched={scenario==="home"} onMatching={()=>nav.push(discovery.survey?homeRoutes.list:homeRoutes.matching)} onExercise={item=>setDetail({type:"pt",item})} onMeal={item=>setDetail({type:"meal",item})} onExerciseMore={()=>setNotice("운동 탭 이동은 실제 홈에서 확인할 수 있어요.")} onMealMore={()=>setNotice("식사 관리 이동은 실제 홈에서 확인할 수 있어요.")} onNewExercise={()=>setNotice("운동 작성은 실제 홈에서 확인할 수 있어요.")} onNewMeal={()=>setNotice("식사 작성은 실제 홈에서 확인할 수 있어요.")}/>
  <NavigationBar tabs={userTabs} state={{routes:userTabs.map(tab=>({key:tab.name,name:tab.name})),index:2}} navigation={{emit:()=>({defaultPrevented:false}),navigate:onClose}} labelClassName="mt-2"/>
 </View>;
 else if(path===homeRoutes.list)content=<DiscoveryScreen/>;
 else if(path===homeRoutes.filter)content=<FilterScreen/>;
 else if(path===homeRoutes.regions)content=<RegionsScreen initialQuery={scenario==="region-search"?"파주시":""} initialProvince={scenario.includes("selected")?"gyeonggi":null}/>;
 else if(path===homeRoutes.compare)content=<CompareScreen/>;
 else if(path==="profile"||path==="profile-empty")content=<MemberProfileScreen profileOverride={profile}/>;
 else if(path.includes("trainer-detail"))content=<MemberProfileScreen trainerId={id}/>;
 else if(path==="reviews"||path.includes("trainer-reviews"))content=<ReviewsScreen trainerId={id}/>;
 else if(path===homeRoutes.matching)content=<HomeMatchingScreen/>;
 else if(path.includes("trainer-chat"))content=<PreviewChat id={id} nav={nav}/>;
 else if(path.includes("request-edit"))content=<PreviewRequest roomId={route.params?.roomId} nav={nav}/>;
 else content=<Text className="p-4 text-14">실제 화면에서 이어서 확인할 수 있어요.</Text>;
 return <HomeNavigationContext.Provider value={nav}><View className="flex-1">{content}
  {detail?.type==="pt"&&<ExerciseDetailSheet visible type="pt" title={detail.item.trainerName} sessionLabel="4 / 10회차" dateLabel="2026년 4월 13일 15:00-16:00" records={detail.item.records} memo={detail.item.memo} onClose={()=>setDetail(null)}/>}
  {detail?.type==="meal"&&<MealRecordDetailSheet record={detail.item} onClose={()=>setDetail(null)} onDelete={()=>{setDetail(null);setNotice("미리보기 기록은 실제 데이터에 영향을 주지 않아요.");}}/>}
 </View></HomeNavigationContext.Provider>;
}
function PreviewChat({id,nav}){const {state,send,sendText,sendPhoto}=useUserTrainer();const room=state.rooms.find(item=>item.id===id);return <UserChatRoom room={room} draft={state.drafts[id]??""} onDraft={text=>send({type:"draft",roomId:id,text})} onBack={nav.back} onSendText={()=>sendText(id)} onSendPhoto={photo=>sendPhoto(id,photo)} onNewRequest={()=>nav.push({pathname:"/(userTrainerFlow)/request-edit",params:{roomId:id}})} onEditRequest={()=>nav.push({pathname:"/(userTrainerFlow)/request-edit",params:{roomId:id}})} onCancelRequest={requestId=>send({type:"cancel-request",roomId:id,requestId,stamp:userMessageStamp()})}/>;}
function PreviewRequest({roomId,nav}){const {submitRequest}=useUserTrainer();return <TrainerMatching onCancel={nav.back} onComplete={(_,details)=>{if(submitRequest(roomId,details))nav.replace(roomRoute(roomId));}}/>;}
function PreviewProviders({scenario,onClose}) {
 const state=useMemo(()=>({...initialDiscoveryState,query:scenario==="search"?"오류":"",filters:{...defaultFilters(),...(["range","filter"].includes(scenario)?{purposes:memberProfileExample.specialties}:{}),...(scenario==="range"?{count:20,min:450000,max:900000}:{}),...(scenario==="applied"?{purposes:["재활운동"]}:{}),regions:scenario.includes("selected")||scenario==="region-search"?locationSearchResults.slice(1,5):[]},compared:scenario==="compare-one"?["jaemin"]:scenario==="compare-two"?["jaemin","nayeon"]:scenario==="compare-three"?["jaemin","nayeon","jiwu"]:[]}),[scenario]);
 const trainers=useMemo(()=>discoveryTrainers.map(item=>item.id==="jaemin"?{...memberProfileExample,specialties:scenario.startsWith("compare")?["체형교정"]:memberProfileExample.specialties,regionIds:item.regionIds}:item),[scenario]);
 return <UserTrainerProvider initialSeed={{rooms:[],selectedTab:"current",drafts:{}}}><DiscoveryProvider initialState={state} trainers={trainers}><PreviewFlow scenario={scenario} onClose={onClose}/></DiscoveryProvider></UserTrainerProvider>;
}
export default function HomePreview(){
 const [scenario,setScenario]=useState(null);const params=useLocalSearchParams();const insets=useSafeAreaInsets();
 useEffect(()=>{if(homeScenarios.some(item=>item[2]===params.homeScenario))setScenario(params.homeScenario);},[params.homeScenario]);
 return <View className="gap-2">{homeScenarios.map(([id,label,key])=><Pressable key={id} accessibilityRole="button" accessibilityLabel={`홈 미리보기 ${label}`} onPress={()=>setScenario(key)} className="rounded-lg bg-white px-3 py-2"><Text className="text-14 font-pretendard-medium text-text">{label}</Text><Text className="text-12 text-grayscale-G500">{id}</Text></Pressable>)}
  <Modal visible={!!scenario} onRequestClose={()=>setScenario(null)} animationType="slide"><SafeAreaView edges={["top"]} className="flex-1 bg-white"><Pressable accessibilityRole="button" accessibilityLabel="홈 미리보기 닫기" className="border-b border-grayscale-G100 px-4 py-2" onPress={()=>setScenario(null)}><Text className="text-12 text-primary-main">미리보기 닫기</Text></Pressable><SafeAreaInsetsContext.Provider value={{...insets,top:0}}>{scenario&&<PreviewProviders key={scenario} scenario={scenario} onClose={()=>setScenario(null)}/>}</SafeAreaInsetsContext.Provider></SafeAreaView></Modal>
 </View>;
}
