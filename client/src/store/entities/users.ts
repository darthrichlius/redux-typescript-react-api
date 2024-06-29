import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  id: number;
  name: string;
}

let lastId = 0;

const slice = createSlice({
  name: "users",
  initialState: [] as IUser[],
  reducers: {
    userAdded: (state, action) => {
      // This mutable code is allowed because we use createSlice
      // createSlice uses ImmerJS under the hood
      state.push({
        id: ++lastId,
        name: action.payload.name,
      });
    },
  },
});

export default slice.reducer;
export const { userAdded } = slice.actions;