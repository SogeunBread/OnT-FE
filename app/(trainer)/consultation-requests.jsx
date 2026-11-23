import ChatList from "@/components/chat_list";
import FieldSearch from "@/components/field/FieldSearch";
import HeaderDetail from "@/components/header_detail";
import { trainerConsultationRequests } from "@/constants/trainerConsultationRequests";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TrainerConsultationRequestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const searchQuery = query.trim().toLocaleLowerCase();
  const requests = trainerConsultationRequests.filter((request) =>
    request.memberName.toLocaleLowerCase().includes(searchQuery),
  );

  const handlePressBack = () => {
    Keyboard.dismiss();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(trainerTabs)/home");
    }
  };

  const handlePressRequest = (request) => {
    Keyboard.dismiss();
    // 상세 채팅 화면 연동 시 이 진입점의 요청 식별자를 사용합니다.
    router.push({
      pathname: "/(trainerTabs)/chat",
      params: { requestId: request.id },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail
        title="신규 상담 요청"
        subtitle=""
        actionType="none"
        onPressBack={handlePressBack}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="px-4 pt-4">
          <FieldSearch
            accessibilityLabel="회원 이름으로 검색"
            placeholder="회원 이름으로 검색"
            className="w-full !py-0"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>
        <FlatList
          className="flex-1"
          data={requests}
          keyExtractor={(request) => request.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 34) }}
          renderItem={({ item }) => (
            <ChatList
              name={`${item.memberName} 회원`}
              message={item.message}
              time={item.time}
              unreadCount={item.unreadCount}
              avatarSource={item.avatarSource}
              avatarContainerClassName="overflow-hidden rounded-full"
              onPress={() => handlePressRequest(item)}
            />
          )}
          ListEmptyComponent={
            <Text
              accessibilityLiveRegion="polite"
              className="px-4 py-8 text-center text-14 font-pretendard-regular text-grayscale-G500"
            >
              {searchQuery
                ? "검색 결과가 없어요."
                : "신규 상담 요청이 없어요."}
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}
