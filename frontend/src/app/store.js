import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/userManagement/userSlice'
import accountsManagementReducer from '../features/accountsManagement/accountsManagementSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    accountsManagement: accountsManagementReducer,
  },

});
