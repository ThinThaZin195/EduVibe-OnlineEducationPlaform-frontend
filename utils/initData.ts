export function initTestData() {
  // Only set if not already set
  if (!localStorage.getItem("users")) {
    const users = [
      { id: 1, email: "admin@eduvibe.com", role: "ADMIN", wallet: 0, enrolledCourses: [] },
      { id: 2, email: "teacher@eduvibe.com", role: "TEACHER", wallet: 0, enrolledCourses: [] },
      { id: 3, email: "student@eduvibe.com", role: "STUDENT", wallet: 50, enrolledCourses: [] },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (!localStorage.getItem("currentUser")) {
    // Default to admin for testing
    const admin = { id: 1, email: "admin@eduvibe.com", role: "ADMIN", wallet: 0, enrolledCourses: [] };
    localStorage.setItem("currentUser", JSON.stringify(admin));
  }

  if (!localStorage.getItem("enrolledCourses")) {
    localStorage.setItem("enrolledCourses", JSON.stringify([]));
  }
}
