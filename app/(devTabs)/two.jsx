import AreaCheck from "@/components/area_check";
import Chip from "@/components/chip/Chip";
import ChipArea from "@/components/chip/ChipArea";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TabTwoScreen() {
  const regions = useMemo(
    () => [
      { id: "paju-simsandong", name: "경기 파주시 심산동" },
      { id: "paju-jangdanmyeon", name: "경기 파주시 장단면" },
      { id: "paju-beopwon", name: "경기 파주시 법원면" },
      { id: "paju-joryeong", name: "경기 파주시 조리읍" },
      { id: "paju-geumchon", name: "경기 파주시 금촌동" },
    ],
    [],
  );

  const [selectedRegionIds, setSelectedRegionIds] = useState([
    "paju-simsandong",
    "paju-geumchon",
  ]);
  const [isChipSelected, setIsChipSelected] = useState(true);

  const selectedRegions = useMemo(
    () => regions.filter((r) => selectedRegionIds.includes(r.id)),
    [regions, selectedRegionIds],
  );

  const toggleRegion = (id) => {
    setSelectedRegionIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const removeRegion = (id) => {
    setSelectedRegionIds((prev) => prev.filter((v) => v !== id));
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="mb-4 text-18 font-pretendard-bold">Chip Test</Text>

      <Text className="mb-2 text-14 font-pretendard-semibold">
        Figma Chip Variants
      </Text>

      <View className="mb-3 flex-row flex-wrap gap-3">
        <Chip text="활성" selected />
        <Chip text="비활성" selected={false} />
      </View>

      <Text className="mb-2 text-14 font-pretendard-semibold">
        Toggle Demo
      </Text>

      <View className="mb-8 flex-row flex-wrap gap-3">
        <Chip
          text={isChipSelected ? "선택됨" : "선택 안 됨"}
          selected={isChipSelected}
          onPress={() => setIsChipSelected((prev) => !prev)}
        />
      </View>

      <Text className="mb-4 text-18 font-pretendard-bold">
        ChipArea (Parent Managed), Checkbox, AreaCheck Test
      </Text>

      <Text className="mb-2 text-14 font-pretendard-semibold">
        선택한 지역 {selectedRegionIds.length}개
      </Text>

      {/* Selected ChipAreas */}
      <View className="mb-6 flex-row flex-wrap gap-3">
        {selectedRegions.map((region) => (
          <ChipArea
            key={region.id}
            text={region.name}
            onClose={() => removeRegion(region.id)}
          />
        ))}
      </View>

      {/* Region selector */}
      <View className="space-y-2">
        {regions.map((region) => {
          const isSelected = selectedRegionIds.includes(region.id);

          return (
            <AreaCheck
              key={region.id}
              onPress={() => toggleRegion(region.id)}
              checked={isSelected}
              label={region.name}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
