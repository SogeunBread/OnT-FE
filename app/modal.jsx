import Modal from "@/components/modal";
import { View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-[8px]">
      <Modal title="타이틀" content="본문 내용" />
    </View>
  );
}
