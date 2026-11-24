// UI-only policies. Do not treat these defaults as an API contract.
export const COUNTS = [1, 10, 15, 20, 25, 30];
export const priceLimits = (count = 10) => ({ min: count * 10000, max: count * 70000, step: 10000 });
export const PRICE_LIMITS = priceLimits();
export const defaultFilters = () => ({ count: 10, min: 100000, max: 700000, regions: [], purposes: [] });
export const initialDiscoveryState = { query: "", filters: defaultFilters(), compared: [], liked: [], survey: null, scrollOffset: 0 };
export function updateRange(range, which, value) {
  if (Number.isNaN(value)) return range;
  const limits = priceLimits(range.count);
  const n = Math.max(limits.min, Math.min(limits.max, Math.round(value / limits.step) * limits.step));
  return which === "min" ? { ...range, min: Math.min(n, range.max) } : { ...range, max: Math.max(n, range.min) };
}
export function toggleRegion(selected, item) {
  return selected.some((region) => region.id === item.id) ? selected.filter((region) => region.id !== item.id) : selected.length < 5 ? [...selected, item] : selected;
}
export function hasFilters(filters) { return JSON.stringify(filters) !== JSON.stringify(defaultFilters()); }
export function filterTrainers(trainers, query, filters) {
  const term = query.trim().toLocaleLowerCase();
  return trainers.filter((trainer) => {
    if (trainer.listVisible === false || (trainer.searchOnly && !term)) return false;
    const price = trainer.prices.find((item) => item.count === filters.count);
    return (!term || `${trainer.name} ${trainer.location?.name ?? ""}`.toLocaleLowerCase().includes(term)) &&
      price && Number(price.price) >= filters.min && Number(price.price) <= filters.max &&
      (!filters.purposes.length || filters.purposes.some((purpose) => trainer.specialties.includes(purpose))) &&
      (!filters.regions.length || filters.regions.some((region) => trainer.regionIds.includes(region.id)));
  });
}
export function discoveryReducer(state, action) {
  switch (action.type) {
    case "query": return { ...state, query: action.value, scrollOffset: 0 };
    case "filters": return { ...state, filters: structuredCopy(action.value), scrollOffset: 0 };
    case "survey": return { ...state, survey: structuredCopy(action.value) };
    case "scroll": return { ...state, scrollOffset: action.value };
    case "like": return { ...state, liked: state.liked.includes(action.id) ? state.liked.filter((id) => id !== action.id) : [...state.liked, action.id] };
    case "compare": return state.compared.includes(action.id) || state.compared.length >= 3 ? state : { ...state, compared: [...state.compared, action.id] };
    case "remove": return { ...state, compared: state.compared.filter((id) => id !== action.id) };
    default: return state;
  }
}
const structuredCopy = (value) => JSON.parse(JSON.stringify(value));
