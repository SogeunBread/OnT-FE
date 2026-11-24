import { useRef, useState } from "react";
import { PanResponder, Platform, View } from "react-native";
import Handle from "@/assets/figma/home-price-handle.svg";
import { priceLimits, updateRange } from "./state";
function Thumb({ which, range, width, onChange }) {
 const limits=priceLimits(range.count);
 const latest=useRef({range,width,onChange});latest.current={range,width,onChange};
 const start=useRef(0);
 const responder=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
  onPanResponderGrant:()=>{start.current=latest.current.range[which];},
  onPanResponderMove:(_,gesture)=>{const {range:r,width:w,onChange:change}=latest.current;change(updateRange(r,which,start.current+gesture.dx/Math.max(w,1)*(priceLimits(r.count).max-priceLimits(r.count).min)));},
 })).current;
 const change=(delta)=>onChange(updateRange(range,which,range[which]+delta));
 const ratio=(range[which]-limits.min)/(limits.max-limits.min);
 return <View {...responder.panHandlers} accessible accessibilityRole="adjustable" accessibilityLabel={which==="min"?"최소 가격":"최대 가격"} accessibilityValue={{min:limits.min,max:limits.max,now:range[which],text:`${range[which].toLocaleString("ko-KR")}원`}}
  accessibilityActions={[{name:"increment"},{name:"decrement"}]} onAccessibilityAction={e=>change(e.nativeEvent.actionName==="increment"?limits.step:-limits.step)}
  onKeyDown={e=>{if(["ArrowLeft","ArrowDown","ArrowRight","ArrowUp","Home","End"].includes(e.key)){e.preventDefault();onChange(updateRange(range,which,e.key==="Home"?limits.min:e.key==="End"?limits.max:range[which]+(["ArrowLeft","ArrowDown"].includes(e.key)?-limits.step:limits.step)));}}}
  aria-valuemin={limits.min} aria-valuemax={limits.max} aria-valuenow={range[which]} aria-valuetext={`${range[which].toLocaleString("ko-KR")}원`}
  tabIndex={0} style={{position:"absolute",left:12+ratio*width-22,top:0,width:44,height:44,alignItems:"center",justifyContent:"center",touchAction:"none"}}>
  <View style={{ width:24, height:24, borderRadius:12, ...(Platform.OS === "web" ? {boxShadow:"0 0 7.2px rgba(0,0,0,0.1)"} : {}) }}><View style={{position:"absolute",left:-7.2,top:-7.2}}><Handle /></View></View>
 </View>;
}
export default function PriceRange({ value, onChange }) {
 const limits=priceLimits(value.count);
 const [width,setWidth]=useState(0);
 const ratio=n=>(n-limits.min)/(limits.max-limits.min);
 return <View className="h-11 w-full" onLayout={e=>setWidth(Math.max(0,e.nativeEvent.layout.width-24))}>
  <View className="absolute left-3 right-3 top-5 h-1 rounded bg-grayscale-G100"/>
  <View className="absolute top-5 h-1 bg-primary-main" style={{left:12+ratio(value.min)*width,width:Math.max(0,(ratio(value.max)-ratio(value.min))*width)}}/>
  <Thumb which="min" range={value} width={width} onChange={onChange}/><Thumb which="max" range={value} width={width} onChange={onChange}/>
 </View>;
}
