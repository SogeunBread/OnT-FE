import AreaCheck from "@/components/area_check";
import Chip from "@/components/chip/Chip";
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
      <Text className="mb-4 text-18 font-pretendard-bold">
        Chip (Parent Managed), Checkbox, AreaCheck Test
      </Text>

      <Text className="mb-2 text-14 font-pretendard-semibold">
        선택한 지역 {selectedRegionIds.length}개
      </Text>

      {/* Selected Chips */}
      <View className="mb-6 flex-row flex-wrap gap-3">
        {selectedRegions.map((region) => (
          <Chip
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
