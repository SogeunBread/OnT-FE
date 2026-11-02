import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

// timeShow is supplied by the conversation: only its final message in a time group shows the time.
export default function Chat({
  writer = "me",
  type = "text",
  text = "텍스트",
  time = "00:00",
  timeShow = true,
  imageSource,
  imageAspectRatio,
  onPressPhoto,
  onImageError,
  imageLabel = "채팅 사진",
  className = "",
}) {
  const mine = writer === "me";
  const source =
    typeof imageSource === "string" ? { uri: imageSource } : imageSource;
  const sourceKey = typeof source === "number" ? source : source?.uri;
  const [loadedRatio, setLoadedRatio] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setLoadedRatio(1);
    setImageFailed(false);
  }, [sourceKey]);
  const ratio =
    Number.isFinite(imageAspectRatio) && imageAspectRatio > 0
      ? imageAspectRatio
      : loadedRatio;
  const photo = (
    <View
      className="w-[200px] max-w-full overflow-hidden rounded-lg bg-grayscale-G400"
      style={{ aspectRatio: ratio }}
    >
      {source && !imageFailed && (
        <Image
          source={source}
          accessibilityLabel={imageLabel}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
          onLoad={({ nativeEvent }) => {
            const { width, height } = nativeEvent.source ?? {};
            if (width > 0 && height > 0) setLoadedRatio(width / height);
          }}
          onError={(event) => {
            setImageFailed(true);
            onImageError?.(event);
          }}
        />
      )}
      {imageFailed && (
        <Text className="p-3 text-12 font-pretendard-regular text-white">
          사진을 불러올 수 없습니다.
        </Text>
      )}
    </View>
  );
  const bubble = (
    <View
      className={`max-w-[280px] min-w-0 shrink rounded-xl ${
        mine ? "bg-primary-main" : "bg-grayscale-G50"
      } ${type === "photo" ? "p-1.5" : "px-3 py-2"}`}
    >
      {type === "photo" ? (
        onPressPhoto ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${imageLabel} 크게 보기`}
            onPress={onPressPhoto}
          >
            {photo}
          </Pressable>
        ) : (
          photo
        )
      ) : (
        <Text
          className={`text-14 font-pretendard-regular ${
            mine ? "text-white" : "text-text"
          }`}
        >
          {text}
        </Text>
      )}
    </View>
  );
  const timestamp =
    timeShow && !!time ? (
      <Text className="shrink-0 text-12 font-pretendard-regular text-grayscale-G500">
        {time}
      </Text>
    ) : null;
  return (
    <View
      className={`w-full flex-row items-end gap-2 ${
        mine ? "justify-end" : "justify-start"
      } ${className}`}
    >
      {mine ? (
        <>
          {timestamp}
          {bubble}
        </>
      ) : (
        <>
          {bubble}
          {timestamp}
        </>
      )}
    </View>
  );
}
