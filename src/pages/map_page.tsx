"use client";
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { DataItem, loadData } from '@/data';
import { filterDataByDecade } from '@/components/helpers';

const Map = lazy(() => import('@/components/map'));

export default function MapPage() {
  const [data, setData] = useState<DataItem[]>([]);
  const [decade, setDecade] = useState<string>('all');

  useEffect(() => {
    loadData().then((jsonData) => {
      setData(jsonData);
    });
  }, []);

  const handleDecadeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDecade(event.target.value);
  };
  
  const filteredData = filterDataByDecade(data, decade);

  return (
    <div>
      <label>
        Select decade:{' '}
        <select value={decade} onChange={handleDecadeChange}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500'>
          <option value="all">All</option>
          <option value="2030">2030</option>
          <option value="2040">2040</option>
          <option value="2050">2050</option>
          <option value="2060">2060</option>
          <option value="2070">2070</option>
        </select>
      </label>
      <Suspense fallback={<div>Loading...</div>}>
        <Map data={filteredData} decade={decade} />
      </Suspense>
    </div>
  );
}