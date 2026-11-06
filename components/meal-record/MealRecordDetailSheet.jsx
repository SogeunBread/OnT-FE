import BottomSheetMeal from "@/components/bottom_sheet_meal";
import { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import ConfirmModal from "@/components/modal";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { useCallback, useState } from "react";
import { Modal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealPhotoViewer from "./MealPhotoViewer";

const HANDLE_STYLE = { paddingTop: 12, paddingBottom: 20 };

export default function MealRecordDetailSheet({ record, onClose, onDelete, onEdit }) {
  const insets = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState(559);
  const [photoIndex, setPhotoIndex] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const closePhoto = useCallback(() => setPhotoIndex(null), []);
  const measureContent = useCallback((_, height) => setContentHeight(height + 36), []);
  const renderBackdrop = useCallback((props) => (
    <BottomSheetBackdrop
      {...props}
      style={[props.style, { backgroundColor: "#111111" }]}
      opacity={0.2}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
      accessibilityLabel="식단 상세보기 닫기"
    />
  ), []);

  return (
    <Modal transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }} accessibilityViewIsModal onAccessibilityEscape={onClose}>
        <BottomSheetMeal
          date={format(parseISO(record.date), "yyyy년 M월 d일 (EEE)", { locale: ko })}
          title={record.title}
          titleNumberOfLines={0}
          time={record.time}
          photos={record.photos.map(({ uri }) => ({ uri }))}
          hasPhotos={record.photos.length > 0}
          mealContent={record.mealContent}
          hasMealContent={Boolean(record.mealContent?.trim())}
          feedback={record.feedback}
          trainerName={record.trainerName ?? "트레이너"}
          trainerProfileSource={record.trainerProfileSource}
          trainerFeedback={record.trainerFeedback ?? ""}
          feedbackTime={record.feedbackTime ?? ""}
          minHeight={Math.min(340, contentHeight)}
          initialHeight={contentHeight}
          enableDynamicSizing={false}
          handleStyle={HANDLE_STYLE}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 34) }}
          onContentSizeChange={measureContent}
          backdropComponent={renderBackdrop}
          photoScrollIndicator={false}
          onPhotoPress={setPhotoIndex}
          editDisabled={!onEdit || record.feedback === MEAL_CARD_FEEDBACK.DONE}
          onEdit={onEdit}
          onDelete={() => setConfirmDelete(true)}
          onClose={onClose}
        />
        {photoIndex !== null && (
          <MealPhotoViewer photos={record.photos} initialIndex={photoIndex} onClose={closePhoto} />
        )}
        {confirmDelete && (
          <Modal transparent animationType="fade" onRequestClose={() => setConfirmDelete(false)}>
            <View
              className="flex-1 items-center justify-center px-4"
              style={{ backgroundColor: "rgba(17,17,17,0.2)" }}
              accessibilityViewIsModal
            >
              <ConfirmModal
                style={{ width: "100%", maxWidth: 358 }}
                title={record.title}
                content="해당 식사를 삭제할까요?"
                leftButtonText="아니오"
                rightButtonText="삭제하기"
                onLeftPress={() => setConfirmDelete(false)}
                onRightPress={() => { onDelete(record.id); onClose(); }}
              />
            </View>
          </Modal>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}
