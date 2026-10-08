import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import MealPhotoViewer from "./MealPhotoViewer";

function releasePhoto(photo) {
  if (Platform.OS === "web" && photo.uri.startsWith("blob:")) URL.revokeObjectURL(photo.uri);
}

export default function MealPhotoField({ photos, onChange, maxPhotos = 4 }) {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState("");
  const [viewingIndex, setViewingIndex] = useState(null);
  const photosRef = useRef(photos);
  const mountedRef = useRef(false);
  const pickingRef = useRef(false);
  const nextId = useRef(1);

  useEffect(() => {
    const previous = photosRef.current;
    photosRef.current = photos;
    previous.filter((photo) => !photos.some((next) => next.id === photo.id)).forEach(releasePhoto);
  }, [photos]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      photosRef.current.forEach(releasePhoto);
    };
  }, []);

  const closeViewer = useCallback(() => setViewingIndex(null), []);
  useFocusEffect(useCallback(() => closeViewer, [closeViewer]));

  const pickPhotos = async () => {
    const remaining = maxPhotos - photosRef.current.length;
    if (pickingRef.current || remaining <= 0) return;
    pickingRef.current = true;
    setIsPicking(true);
    setError("");

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        orderedSelection: true,
        allowsEditing: false,
        quality: 1,
        base64: false,
        exif: false,
      });

      if (result.canceled) return;
      if (!mountedRef.current) {
        result.assets.forEach(releasePhoto);
        return;
      }

      // Web pickers do not enforce selectionLimit, so also cap the returned assets.
      const current = photosRef.current;
      const valid = result.assets.filter((asset) => asset.width > 0 && asset.height > 0);
      const accepted = valid.slice(0, Math.max(0, maxPhotos - current.length));
      result.assets.filter((asset) => !accepted.includes(asset)).forEach(releasePhoto);
      if (valid.length !== result.assets.length) setError("불러올 수 없는 사진이 있어요. 다른 사진을 선택해 주세요.");
      else if (accepted.length < valid.length) setError(`사진은 최대 ${maxPhotos}장까지 추가할 수 있어요.`);

      const added = accepted.map((asset) => ({ ...asset, id: `meal-photo-${nextId.current++}` }));
      const next = [...current, ...added];
      photosRef.current = next;
      onChange(next);
    } catch {
      if (mountedRef.current) setError("사진을 불러오지 못했어요. 다시 시도해 주세요.");
    } finally {
      pickingRef.current = false;
      if (mountedRef.current) setIsPicking(false);
    }
  };

  const removePhoto = (id) => {
    const next = photosRef.current.filter((photo) => photo.id !== id);
    onChange(next);
    setError("");
  };

  const full = photos.length >= maxPhotos;

  return (
    <View className="gap-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          <Pressable
            accessibilityLabel="식사 사진 추가"
            accessibilityRole="button"
            accessibilityState={{ disabled: full || isPicking, busy: isPicking }}
            className="h-[82px] w-[82px] items-center justify-center rounded-[6px] border border-grayscale-G300 bg-white"
            style={{ opacity: full || isPicking ? 0.45 : 1 }}
            disabled={full || isPicking}
            onPress={pickPhotos}
          >
            {isPicking ? (
              <ActivityIndicator color="#707070" />
            ) : (
              <Feather name="plus" size={28} color="#B7B7B7" />
            )}
            <Text className="mt-1 text-12 font-pretendard-regular text-grayscale-G400">
              사진 추가
            </Text>
          </Pressable>
          {photos.map((photo, index) => (
            <View key={photo.id} className="h-[82px] w-[82px]">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`식사 사진 ${index + 1} 크게 보기`}
                className="h-full w-full overflow-hidden rounded-[6px] bg-grayscale-G100"
                onPress={() => setViewingIndex(index)}
              >
                <Image source={{ uri: photo.uri }} className="h-full w-full" resizeMode="cover" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`식사 사진 ${index + 1} 삭제`}
                className="absolute -right-1 -top-1 h-11 w-11 items-end justify-start p-1.5"
                onPress={() => removePhoto(photo.id)}
              >
                <View className="h-5 w-5 items-center justify-center rounded-full bg-black/70">
                  <Feather name="x" size={14} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      {error ? (
        <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">
          {error}
        </Text>
      ) : null}
      {viewingIndex !== null && photos[viewingIndex] && (
        <MealPhotoViewer photos={photos} initialIndex={viewingIndex} onClose={closeViewer} />
      )}
    </View>
  );
}
