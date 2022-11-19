import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import accountsManagementServices from './accountsManagementService'

const initialState = { 
    accounts: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    isCreateAccountLoading: false,
    isCreateAccountError: false,
    isCreateAccountSuccess: false,
};


export const getAllAccounts = createAsyncThunk(
    'accounts/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await accountsManagementServices.getAllAccounts(token)
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


export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (accountData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token
        return await accountsManagementServices.createAccount(accountData, token)
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



export const accountsManagementSlice = createSlice({
    name: 'accountsManagement',
    initialState,
    reducers: {
        reset: (state) => initialState,
        resetAccountCreateForm: (state) => {
            state.isCreateAccountLoading = false
            state.isCreateAccountError = false
            state.isCreateAccountSuccess = false
            state.message = ''
            },
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
          .addCase(createAccount.pending, (state) => {
            state.isCreateAccountLoading = true
          })
          .addCase(createAccount.fulfilled, (state, action) => {
            state.isCreateAccountLoading = false
            state.isCreateAccountSuccess = true
            state.accounts.push(action.payload)
          })
          .addCase(createAccount.rejected, (state, action) => {
            state.isCreateAccountLoading = false
            state.isCreateAccountError = true
            state.message = action.payload
          })
        
    }
});


export const { reset, resetAccountCreateForm } = accountsManagementSlice.actions
export default accountsManagementSlice.reducer
