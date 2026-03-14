export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user") || "null");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/auth/login";
};
