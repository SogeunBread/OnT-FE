import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { Modal, Platform, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/tailwind.config";

// Shared presentation only. Domain actions and permissions belong to the caller.
function SheetContent({
  children,
  header,
  footer,
  onClose,
  initialHeight = 482,
  accessibilityLabel,
  dismissible = true,
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maximum = Math.max(1, height - Math.max(insets.top, 16));
  const first = Math.min(initialHeight + insets.bottom, maximum);
  const snapPoints = [...new Set([first, maximum])];
  const backdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.2}
        pressBehavior={dismissible ? "close" : "none"}
      />
    ),
    [dismissible]
  );
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={dismissible ? onClose : () => {}}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet
          index={0}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose={dismissible}
          onClose={onClose}
          backdropComponent={backdrop}
          keyboardBehavior={
            Platform.OS === "web" ? "fillParent" : "interactive"
          }
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          backgroundStyle={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          handleIndicatorStyle={{
            width: 60,
            height: 4,
            backgroundColor: colors.grayscale.G100,
          }}
        >
          <View style={{ flex: 1 }} accessibilityLabel={accessibilityLabel}>
            {!!header && <View className="px-4 pb-5 pt-3">{header}</View>}
            <BottomSheetScrollView
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: header ? 0 : 16,
                paddingBottom: footer ? 12 : Math.max(16, insets.bottom),
                gap: 16,
              }}
            >
              {children}
            </BottomSheetScrollView>
            {!!footer && (
              <View
                className="border-t border-grayscale-G100 bg-white px-4 pt-2.5"
                style={{ paddingBottom: Math.max(10, insets.bottom) }}
              >
                {footer}
              </View>
            )}
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
}

export default function Sheet({ visible = false, ...props }) {
  return visible ? <SheetContent {...props} /> : null;
}
