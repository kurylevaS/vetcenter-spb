import { RootState } from '@/shared/store/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IExampleSliceState {
  test: boolean;
}

const initialState: IExampleSliceState = {
  test: false,
};

const ExampleSlice = createSlice({
  name: 'exampleName',
  initialState,
  reducers: {
    setHeight: (state, action: PayloadAction<boolean>) => {
      state.test = action.payload;
    },
  },
});

export const exampleNameActions = ExampleSlice.actions;

export const exampleNameSelectors = {
  test: (state: RootState) => state.exampleName.test,
};

export default ExampleSlice.reducer;
