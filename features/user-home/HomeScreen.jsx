import { useState } from "react";
import { ScrollView, Text, Pressable, View } from "react-native";
import { format, parseISO } from "date-fns";
import Calendar from "@/components/calendar";
import MealCard from "@/components/meal_card";
import ExerciseRecordCard from "@/components/exercise/ExerciseRecordCard";
import MealRecordDetailSheet from "@/components/meal-record/MealRecordDetailSheet";
import { useMealRecords } from "@/components/meal-record/MealRecordsContext";
import { useExercise } from "@/features/exercise/ExerciseProvider";
import { useUserTrainer } from "@/features/user-trainer/UserTrainerProvider";
import { canRecordMealOnDate } from "@/components/meal-record/meal-record-date";
import Arrow from "@/assets/figma/home-record-right.svg";
import MatchingBanner from "./MatchingBanner";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { homeRoutes } from "./navigation";
function Section({ title, children, onMore }) {
 return <View className="gap-4"><View className="flex-row items-center justify-between"><Text className="text-16 font-pretendard-semibold text-text">{title}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${title} 더보기`} className="flex-row items-center gap-1" onPress={onMore}><Text className="text-14 text-grayscale-G700">더보기</Text><Arrow /></Pressable></View>{children}</View>;
}
function EmptyRecord({ type, disabled, onPress }) {
 return <Pressable accessibilityRole="button" accessibilityLabel={`${type} 기록하기`} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} className="items-center gap-1 rounded-lg border border-grayscale-G100 p-3"><Text className="text-14 text-grayscale-G500">아직 기록된 {type === "식사" ? "식사가" : "운동이"} 없어요.</Text><Text className={`text-14 ${disabled ? "text-grayscale-G300" : "text-primary-main"}`}>{type} 기록하기</Text></Pressable>;
}
export function HomeView({ date, onDate, events, journals, sessions, meals, matched, onMatching, onExercise, onMeal, onNewExercise, onNewMeal, onExerciseMore, onMealMore, mealDisabled }) {
 return <ScrollView className="flex-1 bg-white" contentContainerStyle={{paddingBottom:24}}>
  <Calendar compact mode="week" selectedTone="primary" selectedDate={parseISO(date)} onDateSelect={onDate} events={events} />
  <View className="gap-5 px-4 pt-4">
   {!matched && <MatchingBanner onPress={onMatching} />}
   <Section title="운동" onMore={onExerciseMore}>{journals.length + sessions.length ? <View className="gap-3">{[...journals.map(item=>({...item,type:"exercise"})),...sessions.map(item=>({...item,type:"pt"}))].map(item=><ExerciseRecordCard key={`${item.type}-${item.id}`} type={item.type} title={item.type === "pt" ? `${item.trainerName.replace(/님$/, "")}님` : item.title} time={`${item.startTime}-${item.endTime}`} location={item.location} exerciseCount={item.records.length} sessionLabel={`${item.sessionNumber} / ${item.totalSessions}회차`} onPress={()=>onExercise(item)} />)}</View> : <EmptyRecord type="운동" onPress={onNewExercise} />}</Section>
   <Section title="식사" onMore={onMealMore}>{meals.length ? <View className="gap-3">{meals.map(meal=><MealCard key={meal.id} title={meal.title || meal.mealContent} time={meal.time} feedback={meal.feedback} thumbnailSource={meal.photos?.[0]?.uri} className="!w-full" onPress={()=>onMeal(meal)} />)}</View> : <EmptyRecord type="식사" disabled={mealDisabled} onPress={onNewMeal} />}</Section>
  </View>
 </ScrollView>;
}
export default function HomeScreen() {
 const { state: exercise, send } = useExercise();
 const { records, deleteRecord, today } = useMealRecords();
 const { state: chat } = useUserTrainer();
 const { state: discovery } = useDiscovery();
 const nav=useHomeNavigation();
 const [dateOverride,setDateOverride]=useState(null);
 const [meal,setMeal]=useState(null);
 const date=dateOverride ?? (exercise.selectedDate || format(today,"yyyy-MM-dd"));
 const choose=(value)=>{const key=format(value,"yyyy-MM-dd");setDateOverride(key);};
 const exerciseMore=(item)=>{send({type:"SELECT_DATE",date}); nav.push({pathname:"/(userTabs)/exercise",params:item?{recordId:item.id,recordType:item.type}:{}});};
 const currentMeal=records.find(item=>item.id===meal);
 const mealRoute=(record)=>({pathname:"/(userTabs)/meal-record",params:{date,...(record&&{recordId:record.id})}});
 return <View className="flex-1"><HomeView date={date} onDate={choose}
  events={[...exercise.journals,...exercise.sessions].map(item=>({date:item.date,type:"exercise"})).concat(records.map(item=>({date:item.date,type:"meal"})))}
  journals={exercise.journals.filter(item=>item.date===date)} sessions={exercise.sessions.filter(item=>item.date===date)} meals={records.filter(item=>item.date===date).sort((a,b)=>a.time.localeCompare(b.time))}
  matched={chat.rooms.some(room=>room.matched)} onMatching={()=>nav.push(discovery.survey ? homeRoutes.list : homeRoutes.matching)}
  onExercise={exerciseMore} onExerciseMore={()=>exerciseMore()} onNewExercise={()=>nav.push({pathname:"/(exerciseFlow)/journal/new",params:{date}})}
  onMeal={item=>setMeal(item.id)} onMealMore={()=>nav.push({pathname:"/(userTabs)/manage",params:{date}})} onNewMeal={()=>nav.push(mealRoute())} mealDisabled={!canRecordMealOnDate(date,today)} />
  {currentMeal&&<MealRecordDetailSheet record={currentMeal} onClose={()=>setMeal(null)} onDelete={deleteRecord} onEdit={()=>{setMeal(null);nav.push(mealRoute(currentMeal));}}/>}
 </View>;
}
