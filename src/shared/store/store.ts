import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import exampleName from './exampleSlice';
import { baseApi } from './api/baseApi';
import { rtkQueryErrorLogger } from './api/middlewares/errorHandling';

const combinedReducer = combineReducers({
  exampleName,
  [baseApi.reducerPath]: baseApi.reducer, // for RTK query
});

export const makeStore = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(rtkQueryErrorLogger) // Логирование ошибок RTK query
      .concat(baseApi.middleware), // api RTK query
});

const typeStore = () => makeStore;

export const wrapper = createWrapper<AppStore>(() => makeStore);
export const store = makeStore;
export type AppStore = ReturnType<typeof typeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
export interface HydrateAction {
  type: typeof HYDRATE;
  payload: RootState;
}
