'use client'

import { AppInfo } from '@/libs/booking';
import React, { PropsWithChildren, createContext, useContext } from 'react';

type AppContextData = {
    appInfo: AppInfo
};

// Create the CategoryContext
const AppContext = createContext<AppContextData | undefined>(undefined);

// Create a custom hook for consuming the CategoryContext
export const useAppContext = (): AppContextData => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};

// Create the CategoryProvider component
export const AppProvider: React.FC<PropsWithChildren<AppContextData>> = ({ children, appInfo }) => {
    const value = {
        appInfo
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;

};
