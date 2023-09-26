import { useAppContext } from '@/contexts/AppContext';
import moment from 'moment-timezone';

type useTimezoneResponse = {
    timezone: string,
    format: (startTime: string, format?: string) => string
}

export function useTimezone(): useTimezoneResponse {
    const { appInfo } = useAppContext();

    const format = (startTime: string, customFormat?: string): string => {
        const formatToUse = customFormat || 'YYYY-MM-DD HH:mm';
        return moment(startTime).tz(appInfo.timezone).format(formatToUse);
    }

    return { timezone: appInfo.timezone, format };
}
