import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
  users: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isCreateUserLoading: false,
  isCreateUserError: false,
  isCreateUserSuccess: false,
  isUpdateUserLoading: false,
  isUpdateUserError: false,
  isUpdateUserSuccess: false,
  message: '',
}



export const getAllUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.getAllUsers(token)
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
)


export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.createUser(userData, token)
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

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (formData, thunkAPI) => {
    console.log( formData)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.updateUser( formData, token)
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
)



export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetUserForm: (state) => {
    state.isCreateUserLoading = false
    state.isCreateUserError = false
    state.isCreateUserSuccess = false
    state.message = ''
    },
    resetUpdateUserForm: (state) => {
      state.isUpdateUserLoading = false
      state.isUpdateUserError = false
      state.isUpdateUserSuccess = false
      state.message = ''
      },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = action.payload
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createUser.pending, (state) => {
        state.isCreateUserLoading = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreateUserLoading = false
        state.isCreateUserSuccess = true
        state.users.push(action.payload)
        state.message = action.payload
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreateUserLoading = false
        state.isCreateUserError = true
        state.message = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.isUpdateUserLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUpdateUserLoading = false
        state.isUpdateUserSuccess = true
        const oldArray = state.users
        const updateArray = oldArray.map((item) => {
          if(item._id === action.payload._id){
            return action.payload
          } else {
            return {...item}}
        })
        state.users = updateArray
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdateUserLoading = false
        state.isUpdateUserError = true
        state.message = action.payload
      })
  },
})

export const { reset, resetUserForm, resetUpdateUserForm } = userSlice.actions
export default userSlice.reducer