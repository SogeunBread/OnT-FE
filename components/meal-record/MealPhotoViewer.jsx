import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function PhotoSlide({ photo, width, height, index, count, active }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const handleLoadStart = useCallback(() => setLoading(true), []);
  const handleLoad = useCallback(() => {
    setLoading(false);
    setFailed(false);
  }, []);
  const handleError = useCallback(() => {
    setLoading(false);
    setFailed(true);
  }, []);

  return (
    <View
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      style={[styles.slide, { width, height }]}
    >
      <Image
        accessibilityLabel={`식사 사진 ${index + 1}, 전체 ${count}장`}
        source={{ uri: photo.uri }}
        style={styles.image}
        resizeMode="contain"
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
      />
      {loading && <ActivityIndicator color="#FFFFFF" style={styles.centered} />}
      {failed && (
        <View style={styles.centered}>
          <Text style={styles.error}>사진을 불러올 수 없어요.</Text>
        </View>
      )}
    </View>
  );
}

export default function MealPhotoViewer({ photos, initialIndex = 0, onClose }) {
  const insets = useSafeAreaInsets();
  const viewport = useWindowDimensions();
  const [width, setWidth] = useState(viewport.width);
  const [pageHeight, setPageHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const listRef = useRef(null);
  const indexRef = useRef(initialIndex);

  const moveTo = useCallback((index) => {
    const next = Math.max(0, Math.min(photos.length - 1, index));
    indexRef.current = next;
    setActiveIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  }, [photos.length]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const offset = event.key === "ArrowLeft" ? -1 : 1;
        moveTo(indexRef.current + offset);
      }
    };

    globalThis.window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      globalThis.window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, moveTo]);

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View
        accessibilityViewIsModal
        onAccessibilityEscape={onClose}
        style={styles.backdrop}
        onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="사진 상세보기 닫기"
            style={styles.iconButton}
            onPress={onClose}
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <FlatList
          key={width}
          ref={listRef}
          data={photos}
          horizontal
          pagingEnabled
          scrollEnabled={photos.length > 1}
          onLayout={({ nativeEvent }) => setPageHeight(nativeEvent.layout.height)}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={activeIndex}
          keyExtractor={(photo) => photo.id}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          renderItem={({ item, index }) => (
            <PhotoSlide
              photo={item}
              width={width}
              height={pageHeight}
              index={index}
              count={photos.length}
              active={index === activeIndex}
            />
          )}
          onScroll={({ nativeEvent }) => {
            const index = Math.max(0, Math.min(
              photos.length - 1,
              Math.round(nativeEvent.contentOffset.x / width),
            ));
            indexRef.current = index;
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
          style={styles.pager}
        />

        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          {Platform.OS === "web" && photos.length > 1 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="이전 사진"
              disabled={activeIndex === 0}
              style={[styles.iconButton, activeIndex === 0 && styles.disabled]}
              onPress={() => moveTo(activeIndex - 1)}
            >
              <Feather name="chevron-left" size={24} color="#FFFFFF" />
            </Pressable>
          )}
          <View
            accessible
            accessibilityLiveRegion="polite"
            accessibilityLabel={`${photos.length}장 중 ${activeIndex + 1}번째 사진`}
            style={styles.dots}
          >
            {photos.length > 1 && photos.map((photo, index) => (
              <View
                key={photo.id}
                style={[styles.dot, index === activeIndex && styles.activeDot]}
              />
            ))}
          </View>
          {Platform.OS === "web" && photos.length > 1 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="다음 사진"
              disabled={activeIndex === photos.length - 1}
              style={[styles.iconButton, activeIndex === photos.length - 1 && styles.disabled]}
              onPress={() => moveTo(activeIndex + 1)}
            >
              <Feather name="chevron-right" size={24} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" },
  header: { alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 8 },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  pager: { flex: 1 },
  slide: { paddingHorizontal: 16 },
  image: { width: "100%", height: "100%" },
  centered: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  error: { color: "#FFFFFF", fontSize: 14, fontFamily: "Pretendard" },
  footer: { minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  dots: { flex: 1, height: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.35)" },
  activeDot: { backgroundColor: "#FFFFFF" },
  disabled: { opacity: 0.3 },
});
