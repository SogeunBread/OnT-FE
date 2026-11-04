import { Text, View } from "react-native";
import { formatExerciseDuration, metricInfo } from "./exerciseModel";

export default function ExerciseRecordList({
  records = [],
  emptyText = "등록된 운동이 없습니다.",
  className = "",
}) {
  if (!records.length)
    return (
      <Text className="text-14 font-pretendard-regular text-grayscale-G500">
        {emptyText}
      </Text>
    );
  return (
    <View className={`w-full gap-4 ${className}`}>
      {records.map((record, index) => {
        const metrics = record.metrics ?? [];
        const sets = record.sets ?? [];
        return (
          <View key={record.id} className="gap-2">
            <View className="flex-row flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <View className="min-w-0 max-w-full flex-row items-center gap-2">
                <Text className="text-18 font-pretendard-bold text-primary-main">
                  {index + 1}
                </Text>
                <Text className="shrink text-16 font-pretendard-medium text-text">
                  {record.name}
                </Text>
              </View>
              {!!record.duration && (
                <Text className="text-right text-14 font-pretendard-semibold text-grayscale-G600">
                  {formatExerciseDuration(record.duration)}
                </Text>
              )}
              {sets.length > 0 && metrics.length > 0 && (
                <View
                  className="ml-auto flex-row gap-2"
                  style={{ width: "60%" }}
                >
                  {metrics.map((id) => (
                    <Text
                      key={id}
                      className="flex-1 text-right text-12 font-pretendard-regular text-grayscale-G400"
                    >
                      {id === "rest" ? "휴식" : metricInfo(id)?.label ?? id}
                    </Text>
                  ))}
                </View>
              )}
            </View>
            {sets.length > 0 && metrics.length > 0 && (
              <>
                {sets.map((set, setIndex) => (
                  <View
                    key={setIndex}
                    className="flex-row items-start justify-between gap-2"
                  >
                    <Text className="w-[50px] text-14 font-pretendard-regular text-grayscale-G600">
                      {setIndex + 1}세트
                    </Text>
                    <View
                      className="min-w-0 flex-row gap-2"
                      style={{ width: "60%" }}
                    >
                      {metrics.map((id) => (
                        <Text
                          key={id}
                          className="min-w-0 flex-1 text-right text-14 font-pretendard-semibold text-grayscale-G600"
                        >
                          {set[id] === undefined || set[id] === ""
                            ? "—"
                            : `${set[id]}${metricInfo(id)?.unit ?? ""}`}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}
