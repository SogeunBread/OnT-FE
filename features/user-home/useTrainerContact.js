import { useDiscovery } from "./DiscoveryProvider";
import { useUserTrainer } from "@/features/user-trainer/UserTrainerProvider";
import { latestRequest } from "@/features/user-trainer/state";
import { useHomeNavigation } from "./FlowNavigation";
import { roomRoute } from "./navigation";
export default function useTrainerContact() {
 const {state:discovery}=useDiscovery();
 const {state,ensureConsultation}=useUserTrainer();const nav=useHomeNavigation();
 return (trainer,request=false)=>{
  const id=ensureConsultation(trainer,discovery.survey??{});if(!id)return;
  const room=state.rooms.find(item=>item.id===id);
  if(request&&!room?.matched&&!["pending","accepted"].includes(latestRequest(room)?.status)) nav.push({pathname:"/(userTrainerFlow)/request-edit",params:{roomId:id}});
  else nav.push(roomRoute(id));
 };
}
