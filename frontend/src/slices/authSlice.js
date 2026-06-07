import { createSlice } from "@reduxjs/toolkit";

// Safely parse token — handles both JSON-stringified and raw JWT strings
function getStoredToken() {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Token was stored as a plain string (not JSON-wrapped) — use it directly
    return raw;
  }
}

const initialState = {
  signupData: null,
  loading: false,
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;