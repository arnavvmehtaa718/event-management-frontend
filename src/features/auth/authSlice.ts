import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import * as authApi from "@/api/authApi"
import type { User } from "@/constants/types"

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const storedToken = localStorage.getItem("eventhub_token")
const storedUser = localStorage.getItem("eventhub_user")

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  "auth/login",
  async (input: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(input.email, input.password)
      return res.data
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  },
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    input: {
      name: string
      email: string
      password: string
      role: "USER" | "ORGANIZER"
      organization?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await authApi.register(input)
      return res.data
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem("eventhub_token")
      localStorage.removeItem("eventhub_user")
    },
    clearError(state) {
      state.error = null
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem("eventhub_user", JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    const persist = (state: AuthState, payload: { user: User; token: string }) => {
      state.loading = false
      state.user = payload.user
      state.token = payload.token
      localStorage.setItem("eventhub_token", payload.token)
      localStorage.setItem("eventhub_user", JSON.stringify(payload.user))
    }
    builder
      .addCase(login.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(login.fulfilled, (s, a) => persist(s, a.payload))
      .addCase(login.rejected, (s, a) => {
        s.loading = false
        s.error = (a.payload as string) ?? "Login failed"
      })
      .addCase(registerUser.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(registerUser.fulfilled, (s, a) => persist(s, a.payload))
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false
        s.error = (a.payload as string) ?? "Registration failed"
      })
  },
})

export const { logout, clearError, updateProfile } = authSlice.actions
export default authSlice.reducer
