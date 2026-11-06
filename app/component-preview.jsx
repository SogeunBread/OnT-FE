import { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, Text, View } from "react-native";
import WorkoutCard from "@/components/workout_card";
import Routine from "@/components/routine";
import Toggle from "@/components/toggle";
import ButtonIcon from "@/components/button_icon";
import ChatList from "@/components/chat_list";
import List from "@/components/list";
import Tag from "@/components/tag";
import HeaderDetail from "@/components/header_detail";
import Field from "@/components/field";
import FieldSearch from "@/components/field/FieldSearch";
import Star from "@/components/star";
import TrainerList from "@/components/trainer_list";
import Chat from "@/components/chat";
import ChatMeal from "@/components/chat_meal";
import ChatPT from "@/components/chat_pt";
import ReviewList from "@/components/review_list";
import Calendar from "@/components/calendar";
import PTScheduleCard from "@/components/pt_schedule_card";
import { chatPreview } from "@/constants/componentPreview";
import { TRAINER_HOME_INITIAL_DATE, trainerHomeSchedules } from "@/constants/trainerHome";
import { trainerConsultationRequests } from "@/constants/trainerConsultationRequests";
import { parseISO } from "date-fns";

const WORKOUT_TYPES = ["type-one", "type-two", "type-three", "no-type"];

function Section({ title, children, fullWidth = false }) {
  return (
    <View className="w-full max-w-[390px] gap-3 self-center">
      <Text className="px-4 text-18 font-pretendard-bold text-text">
        {title}
      </Text>
      <View
        className={`gap-4 overflow-hidden rounded-xl bg-grayscale-G50 py-4 ${
          fullWidth ? "" : "px-4"
        }`}
      >
        {children}
      </View>
    </View>
  );
}

function WorkoutExample({ variant, notify }) {
  const [removed, setRemoved] = useState(false);
  return (
    <View className="gap-2">
      <Text className="text-12 font-pretendard-regular text-grayscale-G600">
        {variant}
      </Text>
      {removed ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setRemoved(false)}
          className="rounded-lg bg-white p-4"
        >
          <Text className="text-14 text-primary-main">운동 카드 복원</Text>
        </Pressable>
      ) : (
        <WorkoutCard
          variant={variant}
          onDelete={() => {
            setRemoved(true);
            notify("운동 삭제");
          }}
          onSetsChange={(rows) => notify(`세트 변경: ${rows.length}개`)}
          onDurationChange={() => notify("운동 시간 변경")}
        />
      )}
    </View>
  );
}

export default function ComponentPreview() {
  const [message, setMessage] = useState("컴포넌트를 눌러 동작을 확인하세요.");
  const [enabled, setEnabled] = useState(false);
  const [rating, setRating] = useState(3);
  const notify = (text) => setMessage(text);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 48, gap: 28 }}
      >
        <View className="w-full max-w-[390px] gap-2 self-center px-4">
          <Link href="/(userTabs)/home" className="text-14 text-primary-main">
            홈으로
          </Link>
          <Text className="text-24 font-pretendard-bold text-text">
            컴포넌트 미리보기
          </Text>
          <Text className="text-14 font-pretendard-regular text-grayscale-G600">
            Figma 24:79 · 15/15종 구현 · API 연결 전
          </Text>
          <View
            accessibilityLiveRegion="polite"
            className="rounded-lg bg-primary-50 p-3"
          >
            <Text className="text-14 font-pretendard-medium text-primary-500">
              {message}
            </Text>
          </View>
        </View>
        <Section title="chat · 텍스트/사진 × 나/상대">
          <View className="gap-5 bg-white p-0">
            <Chat writer="me" />
            <Chat writer="you" />
            <Chat
              type="photo"
              writer="me"
              onPressPhoto={() => notify("내 채팅 사진 선택")}
            />
            <Chat
              type="photo"
              writer="you"
              onPressPhoto={() => notify("상대 채팅 사진 선택")}
            />
          </View>
        </Section>
        <Section title="chat · 긴 메시지 / 시간 생략 / 사진 비율">
          <View className="gap-5 bg-white">
            <Chat writer="you" text={chatPreview.longText} timeShow={false} />
            <Chat writer="you" text="마지막 메시지에 시간이 표시돼요." />
            <Chat
              type="photo"
              imageAspectRatio={2}
              imageLabel="가로 사진"
              onPressPhoto={() => notify("가로 사진 선택")}
            />
            <Chat
              type="photo"
              writer="you"
              imageSource={chatPreview.photo}
              imageLabel="실제 이미지 예제"
              onPressPhoto={() => notify("실제 이미지 선택")}
            />
          </View>
        </Section>
        <Section title="chat-meal · 회원 / 트레이너">
          <ChatMeal
            from="user"
            date={chatPreview.mealDate}
            photoCount={chatPreview.photoCount}
            onPress={() => notify("회원 식단 확인")}
          />
          <ChatMeal
            from="trainer"
            date={chatPreview.mealDate}
            onPress={() => notify("트레이너 피드백 확인")}
          />
        </Section>
        <Section title="chat-PT · 등록 / 수정 / 취소">
          <ChatPT
            variant="create"
            onPress={() => notify("등록된 PT 일정 확인")}
          />
          <ChatPT
            variant="update"
            previousTime={chatPreview.previousTime}
            onPress={() => notify("수정된 PT 일정 확인")}
          />
          <ChatPT variant="delete" />
        </Section>
        <Section title="review-list · 기본 / 긴 리뷰" fullWidth>
          <ReviewList />
          <ReviewList
            name="긴 이름의 회원"
            rating={3}
            date="2026.11.02"
            content="자세를 꼼꼼하게 봐주셔서 좋았어요. 긴 리뷰도 작은 화면에서 잘리지 않고 자연스럽게 여러 줄로 표시됩니다."
          />
        </Section>
        <Section title="workout-card · 4가지 변형">
          {WORKOUT_TYPES.map((variant) => (
            <WorkoutExample key={variant} variant={variant} notify={notify} />
          ))}
        </Section>
        <Section title="routine · 트레이너 지정 여부">
          <Routine
            onPress={() => notify("루틴 선택")}
            onPressMore={() => notify("루틴 더 보기")}
          />
          <Routine
            trainer={false}
            onPress={() => notify("개인 루틴 선택")}
            onPressMore={() => notify("개인 루틴 더 보기")}
          />
        </Section>
        <Section title="toggle · off / on / disabled">
          <View className="flex-row gap-4">
            <Toggle
              value={enabled}
              onValueChange={(value) => {
                setEnabled(value);
                notify(`토글 ${value ? "켜짐" : "꺼짐"}`);
              }}
            />
            <Toggle defaultValue />
            <Toggle disabled />
          </View>
        </Section>
        <Section title="button-icon · 스타일 / 누름 상태">
          {["default", "click"].map((state) => (
            <View key={state} className="flex-row gap-4">
              <ButtonIcon
                state={state}
                onPress={() => notify("흰색 아이콘 버튼")}
              />
              <ButtonIcon
                variant="primary"
                state={state}
                onPress={() => notify("주색 아이콘 버튼")}
              />
            </View>
          ))}
        </Section>
        <Section title="chat-list · 읽지 않은 메시지" fullWidth>
          <ChatList onPress={() => notify("채팅방 선택")} />
          <ChatList
            unreadCount={0}
            onPress={() => notify("읽은 채팅방 선택")}
          />
          <ChatList
            name={`${trainerConsultationRequests[0].memberName} 회원`}
            message={trainerConsultationRequests[0].message}
            time={trainerConsultationRequests[0].time}
            unreadCount={trainerConsultationRequests[0].unreadCount}
            avatarContainerClassName="overflow-hidden rounded-full"
            onPress={() => notify("신규 상담 요청 선택")}
          />
        </Section>
        <Section title="list · 이동 / 토글" fullWidth>
          <List onPress={() => notify("메뉴 선택")} />
          <List
            variant="toggle"
            value={enabled}
            onValueChange={(value) => {
              setEnabled(value);
              notify(`설정 ${value ? "켜짐" : "꺼짐"}`);
            }}
          />
        </Section>
        <Section title="tag · outline / filled">
          <Tag text="근력증가" />
          <Tag text="PT" variant="filled" />
        </Section>
        <Section title="트레이너 홈 · 주간 달력 / PT 일정" fullWidth>
          <Calendar
            compact
            mode="week"
            selectedTone="primary"
            defaultSelectedDate={parseISO(TRAINER_HOME_INITIAL_DATE)}
            events={trainerHomeSchedules.map(({ date }) => ({ date }))}
            onDateSelect={() => notify("PT 일정 날짜 선택")}
          />
          <View className="gap-4 px-4">
            {trainerHomeSchedules.slice(0, 2).map((schedule) => (
              <PTScheduleCard key={schedule.id} {...schedule} />
            ))}
          </View>
        </Section>
        <Section title="header-detail · 3가지 변형" fullWidth>
          {["heart", "compare", "button"].map((actionType) => (
            <HeaderDetail
              key={actionType}
              actionType={actionType}
              includeSafeArea={false}
              onPressBack={() => notify("뒤로 가기")}
              onHeartChange={(value) =>
                notify(`좋아요 ${value ? "선택" : "해제"}`)
              }
              onPressCompare={() => notify("비교함 담기")}
              onPressAction={() => notify("관리 선택")}
            />
          ))}
        </Section>
        <Section title="field · 기본 / 입력 / 채움 / 비활성">
          <FieldSearch className="w-full" accessibilityLabel="기본 검색 입력" />
          <FieldSearch
            className="w-full"
            state="typing"
            defaultValue="content"
            accessibilityLabel="입력 중 검색"
          />
          <FieldSearch
            className="w-full"
            defaultValue="content"
            accessibilityLabel="채워진 검색"
          />
          <FieldSearch
            className="w-full"
            disabled
            defaultValue="content"
            accessibilityLabel="비활성 검색"
          />
          <Field
            className="w-full"
            placeholder="아이콘 없는 입력"
            accessibilityLabel="아이콘 없는 입력"
          />
        </Section>
        <Section title="star · on / off / 선택">
          <View className="flex-row gap-3">
            <Star />
            <Star active={false} />
          </View>
          <View
            accessibilityLabel={`별점 ${rating}점`}
            className="flex-row gap-3"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                active={value <= rating}
                accessibilityLabel={`${value}점 선택`}
                onPress={() => {
                  setRating(value);
                  notify(`별점 ${value}점`);
                }}
              />
            ))}
          </View>
        </Section>
        <Section title="trainer-list · 태그 유무" fullWidth>
          <TrainerList
            tags={["목적", "목적", "목적", "목적", "목적"]}
            onPress={() => notify("트레이너 상세")}
            onPressCompare={() => notify("트레이너 비교함 담기")}
          />
          <TrainerList
            onPress={() => notify("트레이너 상세")}
            onPressCompare={() => notify("트레이너 비교함 담기")}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
