import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import getAccountsListForSideBar from './getAccountsForSidBarServices'

const initialState = { 
    accounts: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};


export const getAllAccounts = createAsyncThunk(
    'accounts/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await getAccountsListForSideBar.getAccountsList(token)
        } catch (error) {
            const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
        }
    }
);


export const getAccountsListForSideBarSlices = createSlice({
    name: 'accountsList',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },

    extraReducers: (builder) => {
        builder
        .addCase(getAllAccounts.pending, (state) => {
            state.isLoading = true
          })
          .addCase(getAllAccounts.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.accounts = action.payload
          })
          .addCase(getAllAccounts.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })
        
    }
});


export const { reset, resetAccountCreateForm } = getAccountsListForSideBarSlices.actions
export default getAccountsListForSideBarSlices.reducer
