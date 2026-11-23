export const exerciseRoutes = {
  home: "/(userTabs)/exercise",
  journalNew: "/(exerciseFlow)/journal/new",
  routineList: "/(exerciseFlow)/routines",
  routineNew: "/(exerciseFlow)/routines/new",
  selection: "/(exerciseFlow)/exercise-select",
};
export const firstParam = (value) => (Array.isArray(value) ? value[0] : value);
export function draftRoute(draft) {
  if (draft.kind === "routine")
    return {
      pathname: draft.sourceId
        ? "/(exerciseFlow)/routines/[id]/edit"
        : exerciseRoutes.routineNew,
      params: {
        ...(draft.sourceId && { id: draft.sourceId }),
        draftId: draft.id,
      },
    };
  if (draft.kind === "pt")
    return {
      pathname: "/(exerciseFlow)/pt/[id]/edit",
      params: { id: draft.sourceId, draftId: draft.id },
    };
  return {
    pathname: draft.sourceId
      ? "/(exerciseFlow)/journal/[id]/edit"
      : exerciseRoutes.journalNew,
    params: {
      ...(draft.sourceId && { id: draft.sourceId }),
      draftId: draft.id,
    },
  };
}
