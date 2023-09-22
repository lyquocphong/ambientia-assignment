import React from 'react';
import Image from 'next/image';
import { AppInfo } from '@/libs/booking';
import * as moment from 'moment-timezone';

type PageLayoutProps = {
    children: (appInfo: AppInfo) => React.ReactNode;
    appInfo: AppInfo;
}

const PageLayout: React.FC<PageLayoutProps> = async ({ children, appInfo }) => {
    return (
        <main className="relative content w-full md:max-w-md min-h-screen">
            {/* Header */}
            <header className='relative w-full text-center mb-3'>
                <div className="hero-image h-24 relative bg-cover bg-center bg-no-repeat">
                    <div
                        className="text-center absolute top-1/2 left-1/2 transform 
                            -translate-x-1/2 -translate-y-1/2 text-white w-5/6">
                        <h1>Welcome to {process.env.COMPANY_NAME}</h1>
                    </div>
                </div>
                <h1 className='text-center'>{`${appInfo.service.name} - ${appInfo.service.price}€`}</h1>
            </header>

            {/* Page Content */}
            <section>
                {children(appInfo)}
            </section>

            {/* Footer */}
            <footer className='text-center absolute bottom-0 left-1/2 transform 
                            -translate-x-1/2 -translate-y-1/2  w-5/6'>
                <p>&copy; {new Date().getFullYear()} {process.env.COMPANY_NAME}. All rights reserved.</p>
            </footer>
        </main>
    );
};

export default PageLayout;
