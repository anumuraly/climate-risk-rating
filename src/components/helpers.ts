import { DataItem } from '@/components/map';

export const filterDataByDecade = (data: DataItem[], decade: string): DataItem[] => {
    if (decade === 'all') {
        return data;
    }

    const startYear = Number(decade);
    const endYear = startYear + 9;

    return data.filter((item) => {
        const year = Number(item.Year);
        return year >= startYear && year <= endYear;
    });
};
