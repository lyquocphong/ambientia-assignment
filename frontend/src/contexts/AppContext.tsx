'use client'

import { AppInfo } from '@/libs/booking';
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

type AppContextData = {
    appInfo: AppInfo,
    updateAppInfo: (newAppInfo: AppInfo) => void
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export const useAppContext = (): AppContextData => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within a AppContextProvider');
    }
    return context;
};

// Create the CategoryProvider component
export const AppProvider: React.FC<PropsWithChildren<Omit<AppContextData, 'updateAppInfo'>>> = ({ children, appInfo }) => {

    const [contextAppInfo, setContextAppInfo] = useState(appInfo);

    const updateAppInfo = (newAppInfo: AppInfo) => {
        setContextAppInfo(newAppInfo);
    };

    const value = {
        appInfo: contextAppInfo,
        updateAppInfo
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;

};
