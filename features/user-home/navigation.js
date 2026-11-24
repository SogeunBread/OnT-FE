export const homeRoutes = { home: "/(userTabs)/home", list: "/(userHomeFlow)/trainer-discovery", filter: "/(userHomeFlow)/discovery-filter", regions: "/(userHomeFlow)/discovery-regions", compare: "/(userHomeFlow)/trainer-compare", matching: "/(userHomeFlow)/home-matching" };
export const trainerRoute = (id) => ({ pathname: "/(userHomeFlow)/trainer-detail/[id]", params: { id } });
export const reviewsRoute = (id) => ({ pathname: "/(userHomeFlow)/trainer-reviews/[id]", params: { id } });
export const roomRoute = (id) => ({ pathname: "/(userTrainerFlow)/trainer-chat/[id]", params: { id } });
export const first = (value) => Array.isArray(value) ? value[0] : value;
