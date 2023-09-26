'use client'

import React from 'react';
import { useAppContext } from '@/contexts/AppContext';

const TimezoneSelector = () => {
  const { appInfo, updateAppInfo } = useAppContext();

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = event.target.value;
    updateAppInfo({ ...appInfo, timezone: newTimezone });
  };

  return (
    <div className='m-2'>
      <label htmlFor="timezone-select">Select Timezone: </label>
      <select
        id="timezone-select"
        value={appInfo.timezone}
        onChange={handleTimezoneChange}
      >
        <option value="Europe/Helsinki">Helsinki</option>
        <option value="Europe/Stockholm">Stockholm</option>        
        <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City</option>
      </select>
    </div>
  );
};

export default TimezoneSelector;
