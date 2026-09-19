import { router } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import AreaChildBg from "../../components/area_child/AreaChildBg";
import AreaChildCheck from "../../components/area_child/AreaChildCheck";
import AreaParent from "../../components/area_parent/AreaParent";
import ButtonTwo from "../../components/button/ButtonTwo";
import CheckSquare from "../../components/check/CheckSquare";
import Checkbox from "../../components/checkbox/Checkbox";
import CheckboxBig from "../../components/checkbox/CheckboxBig";
import ChipArea from "../../components/chip/ChipArea";
import ChipSquare from "../../components/chip/ChipSquare";
import FieldLong from "../../components/field-long/FieldLong";
import FieldSearch from "../../components/field/FieldSearch";
import LeftIcon from "../../components/icons/Left";
import Radio from "../../components/radio/Radio";

const MAX_LOCATION_COUNT = 5;

const locationSearchResults = [
  { id: "paju-all", title: "경기도 파주시 전체", chipTitle: "파주시 전체" },
  { id: "geomsan", title: "경기도 파주시 검산동", chipTitle: "검산동" },
  { id: "gwangtan", title: "경기도 파주시 광탄면", chipTitle: "광탄면" },
  { id: "gyoha", title: "경기도 파주시 교하동", chipTitle: "교하동" },
  { id: "gunnae", title: "경기도 파주시 군내면", chipTitle: "군내면" },
  { id: "geumneung", title: "경기도 파주시 금릉동", chipTitle: "금릉동" },
  { id: "geumchon", title: "경기도 파주시 금촌동", chipTitle: "금촌동" },
  { id: "geumchon1", title: "경기도 파주시 금촌1동", chipTitle: "금촌1동" },
  { id: "geumchon2", title: "경기도 파주시 금촌2동", chipTitle: "금촌2동" },
  { id: "geumchon3", title: "경기도 파주시 금촌3동", chipTitle: "금촌3동" },
  { id: "daeul", title: "경기도 파주시 다율동", chipTitle: "다율동" },
  { id: "dangha", title: "경기도 파주시 당하동", chipTitle: "당하동" },
  { id: "dongpae", title: "경기도 파주시 동패동", chipTitle: "동패동" },
];

const locationData = [
  {
    id: "seoul",
    title: "서울",
    fullTitle: "서울 전체",
    districts: [],
  },
  {
    id: "gyeonggi",
    title: "경기",
    fullTitle: "경기도 전체",
    districts: [
      {
        id: "gyeonggi-all",
        title: "경기 전체",
        chipTitle: "경기도 전체",
        type: "all",
      },
      { id: "gapyeong", title: "가평군", children: [] },
      { id: "goyang-deokyang", title: "고양시 덕양구", children: [] },
      { id: "goyang-ilsandong", title: "고양시 일산동구", children: [] },
      { id: "goyang-ilsanseo", title: "고양시 일산서구", children: [] },
      { id: "gwacheon", title: "과천시", children: [] },
      {
        id: "paju",
        title: "파주시",
        children: [
          { id: "paju-all", title: "파주시 전체", chipTitle: "파주시 전체" },
          { id: "geomsan", title: "검산동" },
          { id: "gwangtan", title: "광탄면" },
          { id: "gyoha", title: "교하동" },
          { id: "gunnae", title: "군내면" },
          { id: "geumneung", title: "금릉동" },
          { id: "geumchon", title: "금촌동" },
          { id: "geumchon1", title: "금촌1동" },
          { id: "geumchon2", title: "금촌2동" },
          { id: "geumchon3", title: "금촌3동" },
        ],
      },
      { id: "gwangju", title: "광주시", children: [] },
      { id: "guri", title: "구리시", children: [] },
      { id: "gunpo", title: "군포시", children: [] },
    ],
  },
  {
    id: "incheon",
    title: "인천",
    fullTitle: "인천 전체",
    districts: [],
  },
  {
    id: "gangwon",
    title: "강원",
    fullTitle: "강원 전체",
    districts: [],
  },
  {
    id: "daejeon",
    title: "대전",
    fullTitle: "대전 전체",
    districts: [],
  },
  {
    id: "sejong",
    title: "세종",
    fullTitle: "세종 전체",
    districts: [],
  },
  {
    id: "chungnam",
    title: "충남",
    fullTitle: "충남 전체",
    districts: [],
  },
  {
    id: "chungbuk",
    title: "충북",
    fullTitle: "충북 전체",
    districts: [],
  },
  {
    id: "busan",
    title: "부산",
    fullTitle: "부산 전체",
    districts: [],
  },
  {
    id: "ulsan",
    title: "울산",
    fullTitle: "울산 전체",
    districts: [],
  },
];

const steps = [
  {
    id: "ptType",
    title: "어떤 PT를 찾고 계신가요?",
    subtitle: "나에게 맞는 트레이너를 더 정확히 추천하기 위한 질문이에요.",
    options: [
      {
        id: "steady",
        title: "꾸준한 관리용",
        subtitle: "다이어트, 근력증대, 바른체형 등의 목표",
      },
      {
        id: "short",
        title: "초단기용",
        subtitle: "운동 자세, 루틴 점검, 컨설팅 등 1-5회 목표",
      },
    ],
  },
  {
    id: "goal",
    title: "어떤 목적으로 운동하시나요?",
    subtitle: "여러 개 선택할 수 있어요.",
    selectionType: "multiple",
    options: [
      {
        id: "learnPosture",
        title: "기본 자세 정확히 배우기",
        subtitle: "스쿼트, 데드리프트, 기구 사용법 등",
      },
      {
        id: "improveFitness",
        title: "체형 점검 받고 개선하기",
        subtitle: "비대칭, 라운드 숄더, 거북목 등",
      },
      {
        id: "shortTermBodyChange",
        title: "단기 목표 바디 체인지",
        subtitle: "바디 프로필, 웨딩, 촬영 준비",
      },
      {
        id: "feedback",
        title: "현재 운동 방식 진단 및 피드백",
        subtitle: "",
      },
      {
        id: "painRelief",
        title: "통증 완화 가능성 트레이닝",
        subtitle: "허리, 무릎 등",
      },
      {
        id: "bodyPartCare",
        title: "선택 부위 관리 운동",
        subtitle: "힙업, 하체, 어깨 등",
      },
      {
        id: "inbody",
        title: "체성분(인바디) 분석과 맞춤 운동 관리",
        subtitle: "",
      },
      {
        id: "competition",
        title: "피트니스 대회 준비를 위한 컨설팅",
        subtitle: "",
      },
      {
        id: "strength",
        title: "근력을 키우고 싶어요.",
        subtitle: "",
      },
      {
        id: "prePostNatal",
        title: "산전/산후 관리를 위한 운동을 하고 싶어요.",
        subtitle: "",
      },
    ],
  },
  {
    id: "experience",
    title: "피트니스 경험이 있으세요?",
    subtitle: "하나만 골라주세요.",
    selectionType: "radio",
    options: [
      {
        id: "none",
        title: "운동을 거의 안 해봤어요.",
      },
      {
        id: "otherSports",
        title: "다른 종목의 운동을 해봤어요.",
      },
      {
        id: "triedGym",
        title: "헬스를 해본 경험이 있어요.",
      },
      {
        id: "hadPt",
        title: "PT를 받아봤어요.",
      },
      {
        id: "longTermGym",
        title: "헬스를 오래 해봤어요.",
      },
    ],
  },
  {
    id: "lessonCount",
    title: "몇 회 레슨을 원하세요?",
    subtitle: "하나만 골라주세요.",
    selectionType: "radio",
    options: [
      {
        id: "10",
        title: "10회",
      },
      {
        id: "20",
        title: "20회",
      },
      {
        id: "30",
        title: "30회",
      },
      {
        id: "unknown",
        title: "잘 모르겠어요.",
      },
    ],
  },
  {
    id: "location",
    title: "레슨 받을 지역을 선택해주세요.",
    subtitle: "선택한 지역을 기반으로 코치님을 추천해드려요.",
    selectionType: "location",
  },
  {
    id: "trainerPreference",
    title: "선호하는 트레이너 조건이 있나요?",
    subtitle: "선호도만 반영되며, 필수 조건은 아닙니다.",
    selectionType: "chipGroups",
    groups: [
      {
        id: "gender",
        title: "성별",
        columns: 3,
        options: [
          { id: "male", title: "남성" },
          { id: "female", title: "여성" },
          { id: "any", title: "상관없음" },
        ],
      },
      {
        id: "age",
        title: "연령대",
        columns: 2,
        options: [
          { id: "20s", title: "20대" },
          { id: "30s", title: "30대" },
          { id: "40plus", title: "40대 이상" },
          { id: "any", title: "상관없음" },
        ],
      },
    ],
  },
  {
    id: "memo",
    title: "코치님이 참고해야 할 내용이 있나요?",
    subtitle: "코치님에게 전달하고 싶은 내용이 있다면 작성해주세요.",
    selectionType: "fieldLong",
    placeholder:
      "예시:\n무릎에 부상 경험이 있어요.\n주 3회 정도 운동하고 싶어요.\n식단 관리도 함께 받고 싶어요.",
    maxLength: 500,
  },
];

export default function TrainerMatching() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const [locationSearchText, setLocationSearchText] = useState("");

  const step = steps[currentStep];
  const selectedValue = answers[step.id];
  const isLastStep = currentStep === steps.length - 1;
  const isMultipleStep = step.selectionType === "multiple";
  const isRadioStep = step.selectionType === "radio";
  const isChipGroupsStep = step.selectionType === "chipGroups";
  const isFieldLongStep = step.selectionType === "fieldLong";
  const isLocationStep = step.selectionType === "location";
  const selectedLocations = isLocationStep ? (selectedValue ?? []) : [];
  const hasSelectedAllChipGroups =
    isChipGroupsStep &&
    step.groups.every((group) => Boolean(selectedValue?.[group.id]));
  const hasSelected = isMultipleStep
    ? Boolean(selectedValue?.length)
    : isChipGroupsStep
      ? hasSelectedAllChipGroups
      : isFieldLongStep
        ? true
        : isLocationStep
          ? selectedLocations.length > 0
          : Boolean(selectedValue);

  const handleSelect = (optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [step.id]: optionId,
    }));
  };

  const handleMultiSelect = (optionId) => {
    setAnswers((prev) => {
      const currentValues = prev[step.id] ?? [];
      const nextValues = currentValues.includes(optionId)
        ? currentValues.filter((value) => value !== optionId)
        : [...currentValues, optionId];

      return {
        ...prev,
        [step.id]: nextValues,
      };
    });
  };

  const handleChipGroupSelect = (groupId, optionId) => {
    setAnswers((prev) => {
      const currentStepAnswer = prev[step.id] ?? {};
      const isSameOption = currentStepAnswer[groupId] === optionId;
      const nextStepAnswer = {
        ...currentStepAnswer,
        [groupId]: isSameOption ? undefined : optionId,
      };

      return {
        ...prev,
        [step.id]: nextStepAnswer,
      };
    });
  };

  const handleTextChange = (text) => {
    setAnswers((prev) => ({
      ...prev,
      [step.id]: text,
    }));
  };

  const handleProvinceSelect = (provinceId) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId(null);
  };

  const toggleLocation = (location) => {
    setAnswers((prev) => {
      const currentValues = prev.location ?? [];
      const isSelected = currentValues.some((item) => item.id === location.id);
      const nextValues = isSelected
        ? currentValues.filter((item) => item.id !== location.id)
        : currentValues.length >= MAX_LOCATION_COUNT
          ? currentValues
          : [...currentValues, location];

      return {
        ...prev,
        location: nextValues,
      };
    });
  };

  const removeLocation = (locationId) => {
    setAnswers((prev) => ({
      ...prev,
      location: (prev.location ?? []).filter((item) => item.id !== locationId),
    }));
  };

  const openLocationSearch = () => {
    setIsLocationSearchOpen(true);
  };

  const closeLocationSearch = () => {
    setIsLocationSearchOpen(false);
    setLocationSearchText("");
  };

  const handlePrev = () => {
    if (isLocationStep && isLocationSearchOpen) {
      closeLocationSearch();
      return;
    }

    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      return;
    }

    router.back();
  };

  const handleNext = () => {
    if (!hasSelected) return;

    if (!isLastStep) {
      if (isLocationStep && isLocationSearchOpen) {
        setIsLocationSearchOpen(false);
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    router.push("/trainer");
  };

  const selectedProvince = locationData.find(
    (province) => province.id === selectedProvinceId,
  );
  const districts = selectedProvince?.districts ?? [];
  const selectedDistrict = districts.find(
    (district) => district.id === selectedDistrictId,
  );
  const townOptions = selectedDistrict?.children ?? [];
  const isLocationSelected = (locationId) =>
    selectedLocations.some((location) => location.id === locationId);
  const normalizedLocationSearchText = locationSearchText.trim();
  const shouldShowLocationSearchResults =
    normalizedLocationSearchText === "파주시";

  if (isLocationStep && isLocationSearchOpen) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-4 pt-[34px]">
          <View className="mb-6 h-8 flex-row items-center gap-5">
            <Pressable
              accessibilityLabel="뒤로가기"
              accessibilityRole="button"
              hitSlop={8}
              onPress={closeLocationSearch}
              className="h-6 w-6 items-center justify-center"
            >
              <LeftIcon />
            </Pressable>

            <Text className="text-18 font-pretendard-bold text-text">
              지역 검색하기
            </Text>
          </View>

          <FieldSearch
            value={locationSearchText}
            onChangeText={setLocationSearchText}
            placeholder=""
            autoFocus
            className="w-full"
            inputClassName="text-14"
          />

          {normalizedLocationSearchText.length > 0 &&
          shouldShowLocationSearchResults ? (
            <View className="mt-4 flex-1">
              <Text className="mb-4 text-14 font-pretendard-semibold text-text">
                '{normalizedLocationSearchText}' 검색 결과 143건
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {locationSearchResults.map((result) => {
                  const checked = isLocationSelected(result.id);

                  return (
                    <CheckSquare
                      key={result.id}
                      label={result.title}
                      checked={checked}
                      onChange={() =>
                        toggleLocation({
                          id: result.id,
                          title: result.chipTitle,
                        })
                      }
                      className="mb-4"
                      labelClassName="font-pretendard-regular"
                    />
                  );
                })}
              </ScrollView>
            </View>
          ) : normalizedLocationSearchText.length > 0 ? (
            <Text className="mt-6 text-center text-16 font-pretendard-semibold text-grayscale-G500">
              '{normalizedLocationSearchText}' 검색 결과가 없습니다.
            </Text>
          ) : (
            <View className="flex-1" />
          )}

          {selectedLocations.length > 0 ? (
            <View className="-mx-4 border-t border-grayscale-G100 px-4 py-3">
              <Text className="mb-3 text-12 font-pretendard-semibold text-text">
                선택한 지역{" "}
                <Text className="text-primary-main">
                  {selectedLocations.length}/{MAX_LOCATION_COUNT}
                </Text>
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {selectedLocations.map((location) => (
                  <ChipArea
                    key={location.id}
                    text={location.title}
                    onPress={() => removeLocation(location.id)}
                    onClose={() => removeLocation(location.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View className="bg-white">
          <ButtonTwo
            nextText={isLastStep ? "완료" : "다음"}
            nextDisabled={!hasSelected}
            onPrevPress={handlePrev}
            onNextPress={handleNext}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-[34px]">
        <View className="mb-10 flex-row gap-[9px]">
          {steps.map((_, index) => (
            <View
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= currentStep ? "bg-[#FF725F]" : "bg-[#E1E1E1]"
              }`}
            />
          ))}
        </View>

        <View className="mb-[42px]">
          <Text className="text-[23px] font-extrabold leading-8 text-[#111111]">
            {step.title}
          </Text>
          <Text className="mt-1 text-[13px] font-normal leading-5 text-[#8F8F8F]">
            {step.subtitle}
          </Text>
        </View>

        {isLocationStep ? (
          <View className="-mx-4 flex-1">
            <Pressable className="px-4" onPress={openLocationSearch}>
              <View pointerEvents="none">
                <FieldSearch
                  placeholder="읍면동으로 검색"
                  className="w-full"
                  inputClassName="text-14"
                />
              </View>
            </Pressable>

            <View className="mt-5 flex-row border-y border-grayscale-G100 bg-[#F7F7F7]">
              <Text
                style={{ width: "20%" }}
                className="py-2 text-center text-12 font-pretendard-semibold text-text-sub"
              >
                시 · 도
              </Text>
              <Text
                style={{ width: "40%" }}
                className="border-x border-grayscale-G100 py-2 text-center text-12 font-pretendard-semibold text-text-sub"
              >
                시 · 군 · 구
              </Text>
              <Text
                style={{ width: "40%" }}
                className="py-2 text-center text-12 font-pretendard-semibold text-text-sub"
              >
                동 · 읍 · 면
              </Text>
            </View>

            <View className="flex-1 flex-row">
              <View
                style={{ width: "20%" }}
                className="border-r border-grayscale-G100"
              >
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                  {locationData.map((province) => (
                    <AreaParent
                      key={province.id}
                      title={province.title}
                      selected={selectedProvinceId === province.id}
                      onChange={() => handleProvinceSelect(province.id)}
                      className="w-full"
                    />
                  ))}
                </ScrollView>
              </View>

              <View
                style={{ width: "40%" }}
                className="border-r border-grayscale-G100"
              >
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                  {districts.map((district) => {
                    if (district.type === "all") {
                      return (
                        <AreaChildCheck
                          key={district.id}
                          title={district.title}
                          checked={isLocationSelected(district.id)}
                          onChange={() => {
                            setSelectedDistrictId(null);
                            toggleLocation({
                              id: district.id,
                              title: district.chipTitle,
                            });
                          }}
                          className="w-full"
                        />
                      );
                    }

                    return (
                      <AreaChildBg
                        key={district.id}
                        title={district.title}
                        selected={selectedDistrictId === district.id}
                        onChange={() => setSelectedDistrictId(district.id)}
                        className="w-full"
                      />
                    );
                  })}
                </ScrollView>
              </View>

              <View style={{ width: "40%" }}>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                  {townOptions.map((town) => (
                    <AreaChildCheck
                      key={town.id}
                      title={town.title}
                      checked={isLocationSelected(town.id)}
                      onChange={() =>
                        toggleLocation({
                          id: town.id,
                          title: town.chipTitle ?? town.title,
                        })
                      }
                      className="w-full"
                    />
                  ))}
                </ScrollView>
              </View>
            </View>

            {selectedLocations.length > 0 ? (
              <View className="border-t border-grayscale-G100 px-4 py-3">
                <Text className="mb-3 text-12 font-pretendard-semibold text-text">
                  선택한 지역{" "}
                  <Text className="text-primary-main">
                    {selectedLocations.length}/{MAX_LOCATION_COUNT}
                  </Text>
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {selectedLocations.map((location) => (
                    <ChipArea
                      key={location.id}
                      text={location.title}
                      onPress={() => removeLocation(location.id)}
                      onClose={() => removeLocation(location.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <ScrollView
            className="-mx-4"
            contentContainerClassName={`px-4 pb-6 ${
              isMultipleStep ||
              isRadioStep ||
              isChipGroupsStep ||
              isFieldLongStep
                ? "gap-[12px]"
                : "gap-[18px]"
            }`}
            showsVerticalScrollIndicator={false}
          >
            {isChipGroupsStep ? (
              step.groups.map((group) => (
                <View key={group.id} className="mb-6">
                  <Text className="mb-3 text-14 font-pretendard-semibold text-text">
                    {group.title}
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {group.options.map((option) => {
                      const selected = selectedValue?.[group.id] === option.id;

                      return (
                        <ChipSquare
                          key={option.id}
                          content={option.title}
                          value={option.id}
                          selected={selected}
                          onChange={(value) =>
                            handleChipGroupSelect(group.id, value)
                          }
                          className={`h-[45px] ${
                            group.columns === 3 ? "w-[31.8%]" : "w-[48.7%]"
                          }`}
                        />
                      );
                    })}
                  </View>
                </View>
              ))
            ) : isFieldLongStep ? (
              <View>
                <Text
                  className={`mb-2 text-right text-12 font-pretendard-regular ${
                    (selectedValue ?? "").length >= step.maxLength
                      ? "text-primary-main"
                      : "text-grayscale-G500"
                  }`}
                >
                  {(selectedValue ?? "").length}/{step.maxLength}
                </Text>

                <FieldLong
                  value={selectedValue ?? ""}
                  onChangeText={handleTextChange}
                  placeholder={step.placeholder}
                  maxLength={step.maxLength}
                  className="w-full"
                />
              </View>
            ) : (
              step.options.map((option) => {
                const checked = isMultipleStep
                  ? Boolean(selectedValue?.includes(option.id))
                  : selectedValue === option.id;

                if (isMultipleStep) {
                  return (
                    <Checkbox
                      key={option.id}
                      title={option.title}
                      subtitle={option.subtitle}
                      checked={checked}
                      onChange={() => handleMultiSelect(option.id)}
                      className="min-h-[56px]"
                    />
                  );
                }

                if (isRadioStep) {
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => handleSelect(option.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: checked }}
                      className="min-h-[56px] w-full flex-row items-center gap-5 rounded-lg bg-white px-4 py-3 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)]"
                    >
                      <Text
                        numberOfLines={1}
                        className="flex-1 text-14 font-pretendard-semibold text-text"
                      >
                        {option.title}
                      </Text>

                      <View pointerEvents="none">
                        <Radio checked={checked} />
                      </View>
                    </Pressable>
                  );
                }

                return (
                  <CheckboxBig
                    key={option.id}
                    title={option.title}
                    subtitle={option.subtitle}
                    checked={checked}
                    onChange={() => handleSelect(option.id)}
                    className="min-h-[88px] px-4 py-[18px]"
                    titleClassName="text-[24px]"
                    subtitleClassName="text-[15px]"
                  />
                );
              })
            )}
          </ScrollView>
        )}
      </View>

      <View className="bg-white">
        <ButtonTwo
          nextText={isLastStep ? "완료" : "다음"}
          nextDisabled={!hasSelected}
          onPrevPress={handlePrev}
          onNextPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}
