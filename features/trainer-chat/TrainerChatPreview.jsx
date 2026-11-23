import NavigationBar from "@/components/navigation/NavigationBar";
import { trainerTabs } from "@/constants/trainerTabs";
import {
  previewConsultationRoom,
  previewMemberRoom,
  trainerChatRooms,
  createMatchedMember,
} from "@/constants/trainerChat";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaInsetsContext, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatListView } from "./ChatListScreen";
import ChatRoom from "./ChatRoom";
import { MemberDetailView } from "./MemberDetailScreen";

const SCENARIOS = [
  ["1907:14918", "내 회원 목록", "member-list"],
  ["1908:15179", "상담 회원 목록", "consultation-list"],
  ["1908:15318", "내 회원 채팅 · 사진", "member-chat"],
  ["2140:20408", "회원 상세보기 · 채팅 진입", "member-detail"],
  ["1957:18001", "상담 요청 도착", "request-only"],
  ["1957:18038", "상담 회원과 채팅", "consultation-chat"],
  ["1957:18658", "PT 수업 요청서", "request-sheet"],
  ["1957:18085", "PT 수업 요청 수락", "accepted"],
  ["1957:18988", "거절 사유 · 선택 전", "reasons"],
  ["1957:19207", "거절 사유 · 선택 후", "reason-selected"],
  ["2140:20060", "기타 거절 사유 입력", "other"],
  ["1957:18844", "PT 수업 요청 거절", "rejected"],
];

const SAMPLE_REJECTION = "현재 신규 회원을 받고 있지 않습니다";

function initialRoom(scenario) {
  const source = scenario.startsWith("member") ? previewMemberRoom : previewConsultationRoom;
  const room = { ...source, messages: source.messages.map((message) => ({ ...message })) };
  if (scenario === "request-only") {
    room.messages = room.messages.filter((message) => message.kind === "request");
  }
  if (scenario === "accepted" || scenario === "rejected") {
    // 완료 프레임은 협의 대화 다음에 요청 카드가 오는 별도의 Figma 예시입니다.
    room.messages = [
      ...room.messages.filter((message) => message.kind !== "request"),
      ...room.messages.filter((message) => message.kind === "request"),
    ];
    room.requestStatus = scenario;
    room.rejectionReason = scenario === "rejected" ? SAMPLE_REJECTION : undefined;
    if (scenario === "accepted") {
      room.category = "member";
      room.member = createMatchedMember(room.request.lessonCount);
    }
    if (scenario === "rejected") {
      room.messages.push(
        { id: "preview-apology", kind: "text", writer: "me", date: "2026-04-20", time: "14:37", text: "아.. 현지님 죄송한데 제가 회원 수가 꽉찼네요 ㅠㅠ" },
        { id: "preview-rejection-text", kind: "text", writer: "me", date: "2026-04-20", time: "14:37", text: "죄송하지만 매칭 거절할게요." },
      );
    }
    room.messages.push({
      id: `preview-${scenario}`,
      kind: scenario,
      reason: room.rejectionReason,
      date: room.messages.at(-1)?.date,
    });
  }
  return room;
}

function PreviewFlow({ scenario, onClose }) {
  const photoUrls = useRef(new Set());
  useEffect(() => () => {
    if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
      photoUrls.current.forEach((uri) => URL.revokeObjectURL(uri));
    }
  }, []);
  const [room, setRoom] = useState(() => initialRoom(scenario));
  const [rooms, setRooms] = useState(trainerChatRooms);
  const [screen, setScreen] = useState(
    scenario.endsWith("list") ? "list" : scenario === "member-detail" ? "member" : "chat",
  );
  const [returnScreen, setReturnScreen] = useState(null);
  const initialTab = scenario === "consultation-list" ? "consultation" : "member";
  const [tab, setTab] = useState(initialTab);

  const updateRoom = (updater) => {
    const next = updater(room);
    setRoom(next);
    setRooms((items) => items.map((item) => item.id === next.id ? next : item));
  };
  const appendMessage = (message) => {
    updateRoom((current) => ({
      ...current,
      messages: [...current.messages, {
        id: `preview-message-${Date.now()}-${current.messages.length}`,
        writer: "me",
        date: new Date().toLocaleDateString("en-CA"),
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
        ...message,
      }],
    }));
  };
  const decideRequest = (status, reason) => {
    updateRoom((current) => ({
      ...current,
      requestStatus: status,
      rejectionReason: reason,
      category: status === "accepted" ? "member" : current.category,
      member: status === "accepted" ? createMatchedMember(current.request.lessonCount) : current.member,
      messages: [...current.messages, {
        id: `preview-${status}-${current.messages.length}`,
        kind: status,
        reason,
        date: new Date().toLocaleDateString("en-CA"),
      }],
    }));
  };
  const openRoom = (item) => {
    setRoom({ ...item, unreadCount: 0 });
    setRooms((items) => items.map((current) => current.id === item.id ? { ...current, unreadCount: 0 } : current));
    setTab(item.category);
    setReturnScreen("list");
    setScreen("chat");
  };
  const backFromChat = () => {
    if (returnScreen === "list") setScreen("list");
    else onClose();
  };

  if (screen === "list") {
    return (
      <View className="flex-1 bg-white">
        <ChatListView rooms={rooms} initialTab={tab} onOpenRoom={openRoom} />
        <NavigationBar
          tabs={trainerTabs}
          state={{ routes: trainerTabs.map((item) => ({ key: item.name, name: item.name })), index: 3 }}
          navigation={{
            emit: () => ({ defaultPrevented: false }),
            navigate: (name) => {
              if (name === "manage") {
                setRoom(previewMemberRoom);
                setReturnScreen("list");
                setScreen("member");
              } else if (name !== "chat") onClose();
            },
          }}
          labelClassName="mt-2"
        />
      </View>
    );
  }
  if (screen === "member") {
    return (
      <MemberDetailView
        room={room}
        onBack={() => returnScreen ? setScreen(returnScreen) : onClose()}
        onChat={() => setScreen("chat")}
      />
    );
  }
  return (
    <ChatRoom
      key={room.id}
      room={room}
      onBack={backFromChat}
      onManage={() => { setReturnScreen("chat"); setScreen("member"); }}
      onSendText={(text) => appendMessage({ kind: "text", text })}
      onSendPhoto={(photo) => {
        if (photo.uri.startsWith("blob:")) photoUrls.current.add(photo.uri);
        appendMessage({ kind: "photo", imageSource: { uri: photo.uri }, imageAspectRatio: photo.width / photo.height });
      }}
      onAccept={() => decideRequest("accepted")}
      onReject={(reason) => decideRequest("rejected", reason)}
      initialRequestStep={
        scenario === "request-sheet" ? "request"
          : ["reasons", "reason-selected"].includes(scenario) ? "reasons"
          : scenario === "other" ? "other" : undefined
      }
      initialRequestReason={scenario === "reason-selected" ? SAMPLE_REJECTION : undefined}
    />
  );
}

export default function TrainerChatPreview() {
  const [scenario, setScenario] = useState(null);
  const insets = useSafeAreaInsets();
  return (
    <View className="gap-2">
      <Text className="text-12 font-pretendard-regular text-grayscale-G600">
        12개 Figma 상태 · 로컬 예시 데이터 · 메시지와 요청 처리를 확인할 수 있어요.
      </Text>
      {SCENARIOS.map(([id, label, key]) => (
        <Pressable
          key={id}
          accessibilityRole="button"
          accessibilityLabel={`미리보기 ${label}`}
          onPress={() => setScenario(key)}
          className="rounded-lg bg-white px-3 py-2.5"
        >
          <Text className="text-14 font-pretendard-medium text-text">{label}</Text>
          <Text className="text-12 font-pretendard-regular text-grayscale-G500">{id}</Text>
        </Pressable>
      ))}
      <Modal
        visible={scenario !== null}
        animationType="slide"
        onRequestClose={() => setScenario(null)}
      >
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="채팅 미리보기 닫기"
            className="border-b border-grayscale-G100 px-4 py-2"
            onPress={() => setScenario(null)}
          >
            <Text className="text-12 font-pretendard-semibold text-primary-main">
              미리보기 닫기
            </Text>
          </Pressable>
          <SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>
            {scenario ? <PreviewFlow key={scenario} scenario={scenario} onClose={() => setScenario(null)} /> : null}
          </SafeAreaInsetsContext.Provider>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
