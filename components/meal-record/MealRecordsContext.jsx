import { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import { addDays, isSameDay, startOfDay } from "date-fns";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { canRecordMealOnDate } from "./meal-record-date";
import {
  createFeedbackMealSample,
  createNoTrainerMealSample,
  createNotRequestedMealSample,
  createWaitingMealSample,
} from "./meal-feedback-sample";

const MealRecordsContext = createContext(null);

const feedbackForDraft = (draft) => !draft.hasMatchedTrainer
  ? MEAL_CARD_FEEDBACK.NONE
  : draft.feedbackRequested
    ? MEAL_CARD_FEEDBACK.WAITING
    : MEAL_CARD_FEEDBACK.NOT_REQUESTED;

export function MealRecordsProvider({ children }) {
  const [records, setRecords] = useState(() => [
    createFeedbackMealSample(),
    createWaitingMealSample(),
    createNotRequestedMealSample(),
    createNoTrainerMealSample(),
  ]);
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

  const savePhotos = useCallback((draftPhotos) => {
    // The form releases its web previews when cleared; saved photos own separate URLs.
    return draftPhotos.map((photo) => {
      if (Platform.OS !== "web" || !photo.file) return { ...photo };
      const uri = URL.createObjectURL(photo.file);
      photoUrls.current.add(uri);
      const { file, ...savedPhoto } = photo;
      return { ...savedPhoto, uri };
    });
  }, []);

  const addRecord = useCallback((draft) => {
    if (!canRecordMealOnDate(draft.date)) return null;
    const record = {
      ...draft,
      id: `meal-record-${++nextId.current}`,
      photos: savePhotos(draft.photos),
      feedback: feedbackForDraft(draft),
    };
    setRecords((previous) => [...previous, record]);
    return record;
  }, [savePhotos]);

  const updateRecord = useCallback((id, draft) => {
    const previous = records.find((record) => record.id === id);
    if (!previous || previous.feedback === MEAL_CARD_FEEDBACK.DONE || !canRecordMealOnDate(draft.date)) return null;
    const nextDraft = {
      ...draft,
      hasMatchedTrainer: previous.hasMatchedTrainer,
      feedbackRequested: Boolean(previous.feedbackRequested || draft.feedbackRequested),
    };
    const record = { ...previous, ...nextDraft, id, photos: savePhotos(nextDraft.photos), feedback: feedbackForDraft(nextDraft) };
    previous.photos.forEach(({ uri }) => {
      if (!record.photos.some((photo) => photo.uri === uri) && photoUrls.current.delete(uri)) URL.revokeObjectURL(uri);
    });
    setRecords((items) => items.map((item) => item.id === id ? record : item));
    return record;
  }, [records, savePhotos]);

  const deleteRecord = useCallback((id) => {
    const record = records.find((item) => item.id === id);
    record?.photos.forEach(({ uri }) => {
      if (photoUrls.current.delete(uri)) URL.revokeObjectURL(uri);
    });
    setRecords((previous) => previous.filter((item) => item.id !== id));
  }, [records]);

  const value = useMemo(() => ({ records, addRecord, updateRecord, deleteRecord, today }), [records, addRecord, updateRecord, deleteRecord, today]);
  return <MealRecordsContext.Provider value={value}>{children}</MealRecordsContext.Provider>;
}

export function useMealRecords() {
  const context = useContext(MealRecordsContext);
  if (!context) throw new Error("useMealRecords requires MealRecordsProvider");
  return context;
}
