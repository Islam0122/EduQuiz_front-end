import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLanguage: "javascript", // По умолчанию
  questions: [], // Суроолор
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
  },
});

export const { setLanguage, setQuestions } = quizSlice.actions;
export default quizSlice.reducer;