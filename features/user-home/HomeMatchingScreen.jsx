import TrainerMatching from "@/app/(userTabs)/trainer-matching";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
import { homeRoutes } from "./navigation";
export default function HomeMatchingScreen(){
 const {state,send}=useDiscovery();const nav=useHomeNavigation();
 return <TrainerMatching initialAnswers={state.survey??{}} onCancel={nav.goBack} onComplete={(answers)=>{send({type:"survey",value:answers});nav.replace(homeRoutes.list);}}/>;
}
