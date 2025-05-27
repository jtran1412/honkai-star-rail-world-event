import { configureStore } from "@reduxjs/toolkit";
import summonReducer from "../features/summon/summonSlice";

export const store = configureStore({
  reducer: {
    summon: summonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
