import { RootState } from '@/shared/store/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FeedbackModalMetadata {
  doctor?: string; // ФИО врача
  service_name?: string; // Название услуги
}

interface IFeedbackModalState {
  isOpen: boolean;
  metadata: FeedbackModalMetadata | null;
  isLoading: boolean;
}

const initialState: IFeedbackModalState = {
  isOpen: false,
  metadata: null,
  isLoading: false,
};

const feedbackModalSlice = createSlice({
  name: 'feedbackModal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<FeedbackModalMetadata | undefined>
    ) => {
      state.isOpen = true;
      state.metadata = action.payload || null;
      state.isLoading = false;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.metadata = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const feedbackModalActions = feedbackModalSlice.actions;

export const feedbackModalSelectors = {
  isOpen: (state: RootState) => state.feedbackModal.isOpen,
  metadata: (state: RootState) => state.feedbackModal.metadata,
  isLoading: (state: RootState) => state.feedbackModal.isLoading,
};

export default feedbackModalSlice.reducer;
