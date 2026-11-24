import Avatar from "@/assets/figma/profile-avatar-edit.svg";
import Camera from "@/assets/figma/profile-camera.svg";
import ChipSquare from "@/components/chip/ChipSquare";
import Field from "@/components/field";
import HeaderDetail from "@/components/header_detail";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function FieldGroup({ label, children }) {
  return (
    <View className="gap-2">
      <Text className="text-14 font-pretendard-semibold text-text">
        {label}<Text className="text-primary-main"> *</Text>
      </Text>
      {children}
    </View>
  );
}

export default function AccountProfileForm({
  value,
  onChange,
  onBack,
  onLogout,
  onWithdraw,
  error = "",
  pickingPhoto = false,
  onPickPhoto,
}) {
  const insets = useSafeAreaInsets();
  const birthDate = value.birthDate ?? "";
  // Keep partially edited text intact; only format a complete stored ISO date.
  const birthDateText = /^\d{4}-\d{2}-\d{2}$/.test(birthDate)
    ? birthDate.replace(/-/g, ". ")
    : birthDate;

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail
        title="프로필 설정"
        subtitle=""
        actionType="none"
        onPressBack={onBack}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            flexGrow: 1,
            gap: 16,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 34) + 16,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="프로필 사진 변경"
            accessibilityState={{ busy: pickingPhoto, disabled: pickingPhoto }}
            disabled={pickingPhoto}
            onPress={onPickPhoto}
            className="h-[100px] w-[100px] self-center"
          >
            {value.avatarSource ? (
              <Image
                accessibilityLabel="프로필 사진"
                source={typeof value.avatarSource === "string"
                  ? { uri: value.avatarSource }
                  : value.avatarSource}
                className="h-[100px] w-[100px] rounded-full"
              />
            ) : (
              <View className="h-[100px] w-[100px] overflow-hidden rounded-full"><Avatar /></View>
            )}
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-white">
              {pickingPhoto ? <ActivityIndicator size="small" /> : <Camera />}
            </View>
          </Pressable>
          <FieldGroup label="이름">
            <Field
              className="w-full"
              accessibilityLabel="이름"
              value={value.name ?? ""}
              onChangeText={(text) => onChange?.("name", text)}
              autoComplete="name"
              autoCorrect={false}
              placeholder=""
            />
          </FieldGroup>
          <FieldGroup label="생년월일">
            <Field
              className="w-full"
              accessibilityLabel="생년월일"
              value={birthDateText}
              onChangeText={(text) => onChange?.("birthDate", text)}
              keyboardType="number-pad"
              placeholder=""
            />
          </FieldGroup>
          <FieldGroup label="연락처">
            <Field
              className="w-full"
              accessibilityLabel="연락처"
              value={value.phone ?? ""}
              onChangeText={(text) => onChange?.("phone", text)}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder=""
            />
          </FieldGroup>
          <FieldGroup label="성별">
            <View accessibilityRole="radiogroup" className="flex-row gap-2">
              <ChipSquare
                content="남성"
                value="male"
                selected={value.gender === "male"}
                onChange={(gender) => onChange?.("gender", gender)}
                accessibilityRole="radio"
                accessibilityLabel="남성"
                aria-checked={value.gender === "male"}
                accessibilityState={{ checked: value.gender === "male" }}
                className="h-[45px] flex-1 rounded-lg py-0"
              />
              <ChipSquare
                content="여성"
                value="female"
                selected={value.gender === "female"}
                onChange={(gender) => onChange?.("gender", gender)}
                accessibilityRole="radio"
                accessibilityLabel="여성"
                aria-checked={value.gender === "female"}
                accessibilityState={{ checked: value.gender === "female" }}
                className="h-[45px] flex-1 rounded-lg py-0"
              />
            </View>
          </FieldGroup>
          {error ? (
            <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">
              {error}
            </Text>
          ) : null}
          <View className="min-h-4 flex-1" />
          <View className="flex-row items-center justify-center gap-2">
            <Pressable accessibilityRole="button" onPress={onLogout} hitSlop={8}>
              <Text className="text-12 font-pretendard-regular text-grayscale-G400">로그아웃</Text>
            </Pressable>
            <View className="h-2 w-px bg-grayscale-G400" />
            <Pressable accessibilityRole="button" onPress={onWithdraw} hitSlop={8}>
              <Text className="text-12 font-pretendard-regular text-grayscale-G400">회원탈퇴</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
