import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/userManagement/userSlice'
import accountsManagementReducer from '../features/accountsManagement/accountsManagementSlice'
import getAccountsListForSideBarReducer from '../features/getAccountsForSidBar/getAccountsForSidBarSlices'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    accountsManagement: accountsManagementReducer,
    accountsList: getAccountsListForSideBarReducer,
  },

});
