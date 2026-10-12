import { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import { addDays, isSameDay, startOfDay } from "date-fns";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { canRecordMealOnDate } from "./meal-record-date";

const MealRecordsContext = createContext(null);

export function MealRecordsProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const nextId = useRef(0);
  const photoUrls = useRef(new Set());

  useEffect(() => {
    let timer;
    const refreshToday = () => {
      const now = new Date();
      setToday((previous) => isSameDay(previous, now) ? previous : startOfDay(now));
      clearTimeout(timer);
      timer = setTimeout(refreshToday, startOfDay(addDays(now, 1)).getTime() - now.getTime() + 50);
    };
    refreshToday();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshToday();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const urls = photoUrls.current;
    return () => {
      urls.forEach((uri) => URL.revokeObjectURL(uri));
      urls.clear();
    };
  }, []);

  const addRecord = useCallback((draft) => {
    if (!canRecordMealOnDate(draft.date)) return null;
    // The form releases its web previews when cleared; saved photos own separate URLs.
    const photos = draft.photos.map((photo) => {
      if (Platform.OS !== "web" || !photo.file) return { ...photo };
      const uri = URL.createObjectURL(photo.file);
      photoUrls.current.add(uri);
      const { file, ...savedPhoto } = photo;
      return { ...savedPhoto, uri };
    });
    const record = {
      ...draft,
      id: `meal-record-${++nextId.current}`,
      photos,
      feedback: !draft.hasMatchedTrainer
        ? MEAL_CARD_FEEDBACK.NONE
        : draft.feedbackRequested
          ? MEAL_CARD_FEEDBACK.WAITING
          : MEAL_CARD_FEEDBACK.NOT_REQUESTED,
    };
    setRecords((previous) => [...previous, record]);
    return record;
  }, []);

  const value = useMemo(() => ({ records, addRecord, today }), [records, addRecord, today]);
  return <MealRecordsContext.Provider value={value}>{children}</MealRecordsContext.Provider>;
}

export function useMealRecords() {
  const context = useContext(MealRecordsContext);
  if (!context) throw new Error("useMealRecords requires MealRecordsProvider");
  return context;
}
