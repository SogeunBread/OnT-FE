import WheelPicker from "@quidone/react-native-wheel-picker";
import { colors } from "@/tailwind.config";
import { Text, View } from "react-native";
import { MEAL_TIME_COLUMNS } from "./meal-time-options";

export default function MealTimePicker({ value, onChange, label = "식사 시간" }) {
  return (
    <View className="flex-row gap-4">
      {MEAL_TIME_COLUMNS.map(({ unit, title, options }) => (
        <View key={unit} className="min-w-0 flex-1 gap-2">
          <Text className="text-center text-14 font-pretendard-semibold text-grayscale-G500">
            {title}
          </Text>
          <View accessibilityLabel={`${label} ${title}`}>
            <WheelPicker
              data={options}
              value={unit === "hour" ? value.getHours() : value.getMinutes()}
              onValueChanged={({ item }) => {
                const next = new Date(value);
                next.setHours(
                  unit === "hour" ? item.value : value.getHours(),
                  unit === "minute" ? item.value : value.getMinutes(),
                  0,
                  0,
                );
                onChange(next);
              }}
              width="100%"
              itemHeight={44}
              visibleItemCount={5}
              enableScrollByTapOnItem
              itemTextStyle={{ fontSize: 24, color: colors.text.DEFAULT }}
              overlayItemStyle={{
                backgroundColor: colors.primary[50],
                borderRadius: 6,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
