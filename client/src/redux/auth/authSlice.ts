
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  setUser:null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   setUser:(state,action)=>{
    state.setUser=action.payload;
   }
  }
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;
