// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import summonReducer from "../features/summon/summonSlice";

const store = configureStore({
  reducer: {
    summon: summonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
