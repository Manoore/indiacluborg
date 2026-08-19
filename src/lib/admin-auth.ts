const KEY = "heartwalk_admin_session";

export function isAdminLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "true";
}

export function adminLogin() {
  window.localStorage.setItem(KEY, "true");
}

export function adminLogout() {
  window.localStorage.removeItem(KEY);
}
