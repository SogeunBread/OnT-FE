import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { emptyExerciseState, exerciseReducer } from "./state";
import { createExerciseSeed } from "./mockData";

const ExerciseContext = createContext(null);
let nextId = 0;
export const newExerciseId = (prefix = "draft") =>
  `${prefix}-${Date.now()}-${++nextId}`;

export function ExerciseProvider({ children }) {
  const [state, dispatch] = useReducer(exerciseReducer, emptyExerciseState);
  const current = useRef(state);
  current.current = state;
  const insets = useSafeAreaInsets();
  const send = useCallback((action) => {
    const next = exerciseReducer(current.current, action);
    current.current = next;
    dispatch(action);
    return next.result;
  }, []);
  useEffect(() => {
    send({ type: "INITIALIZE", seed: createExerciseSeed() });
  }, [send]);
  useEffect(() => {
    if (!state.notice) return;
    const timer = setTimeout(() => send({ type: "CLEAR_NOTICE" }), 3000);
    return () => clearTimeout(timer);
  }, [state.notice, send]);
  return (
    <ExerciseContext.Provider value={{ state, send }}>
      {children}
      {!!state.notice && (
        <View
          pointerEvents="none"
          className="absolute left-4 right-4 items-center"
          style={{ bottom: Math.max(insets.bottom, 16) + 100 }}
        >
          <View className="max-w-[390px] rounded-lg bg-grayscale-G800 px-4 py-3">
            <Text
              accessibilityLiveRegion="polite"
              className="text-center text-14 font-pretendard-medium text-white"
            >
              {state.notice}
            </Text>
          </View>
        </View>
      )}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) throw new Error("ExerciseProvider가 필요합니다.");
  return context;
}
