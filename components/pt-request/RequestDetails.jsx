import { Text, View } from "react-native";

function RequestField({ label, value, children }) {
  return (
    <View className="gap-1">
      <Text className="text-14 font-pretendard-regular text-grayscale-G600">
        {label}
      </Text>
      {children ?? (
        <Text className="text-16 font-pretendard-medium text-text">
          {Array.isArray(value) ? value.join("・") : value || "—"}
        </Text>
      )}
    </View>
  );
}

export default function RequestDetails({ request }) {
  const count = request?.lessonCount;
  const countLabel = count == null || count === "" ? "—" : (/^\d+$/.test(String(count)) ? `${count}회` : String(count));
  return (
          <View className="gap-5">
            <RequestField label="목적" value={request?.purpose} />
            <RequestField label="세부 목적" value={request?.detailPurpose} />
            <RequestField label="경험" value={request?.experience} />
            <RequestField label="횟수" value={countLabel} />
            <RequestField label="지역">
              <View className="flex-row flex-wrap gap-x-2 gap-y-1">
                {(request?.regions ?? []).map((region, index) => (
                  <View key={`${region}-${index}`} className="rounded-full bg-grayscale-G50 px-2 py-1">
                    <Text className="text-14 font-pretendard-medium text-grayscale-G800">
                      {region}
                    </Text>
                  </View>
                ))}
              </View>
            </RequestField>
            <RequestField label="선호 트레이너" value={request?.preferredTrainer} />
            <RequestField label="전달사항" value={request?.note} />
          </View>
  );
}
