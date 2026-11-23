import ChatList from "@/components/chat_list";
import FieldSearch from "@/components/field/FieldSearch";
import Tab from "@/components/tab";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Keyboard, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrainerChat } from "./TrainerChatProvider";

export function ChatListView({ rooms, initialTab = "member", onOpenRoom }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase();
  const visible = rooms.filter((room) => room.category === tab && room.memberName.toLocaleLowerCase().includes(search));
  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row">
        {[["member", "내 회원"], ["consultation", "상담 회원"]].map(([key, label]) => (
          <Tab key={key} text={label} selected={tab === key}
            className={`flex-1 !py-3 ${tab === key ? "" : "!border-b"}`}
            textClassName={tab === key ? "" : "!font-pretendard-regular"}
            onPress={() => { setTab(key); Keyboard.dismiss(); }} />
        ))}
      </View>
      <View className="p-4">
        <FieldSearch className="w-full !py-0" accessibilityLabel="회원 이름으로 검색"
          placeholder="회원 이름으로 검색" value={query} onChangeText={setQuery}
          autoCapitalize="none" autoCorrect={false} returnKeyType="search" onSubmitEditing={Keyboard.dismiss} />
      </View>
      <FlatList data={visible} keyExtractor={(room) => room.id}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => <ChatList name={`${item.memberName} 회원`}
          message={item.message} time={item.time} unreadCount={item.unreadCount}
          avatarSource={item.avatarSource} avatarContainerClassName="overflow-hidden rounded-full"
          onPress={() => { Keyboard.dismiss(); onOpenRoom(item); }} />}
        ListEmptyComponent={<Text accessibilityLiveRegion="polite" className="px-4 py-8 text-center text-14 font-pretendard-regular text-grayscale-G500">
          {search ? "검색 결과가 없어요." : tab === "member" ? "채팅 중인 회원이 없어요." : "상담 중인 회원이 없어요."}
        </Text>} />
    </View>
  );
}

export default function TrainerChatListScreen() {
  const router = useRouter();
  const { rooms } = useTrainerChat();
  return <ChatListView rooms={rooms} onOpenRoom={(room) => router.push({ pathname: "/(trainer)/chat/[id]", params: { id: room.id } })} />;
}
