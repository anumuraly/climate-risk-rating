"use client";
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import loadData, { DataItem } from '@/data';

const DataTable = lazy(() => import('@/components/dataTable'));

const DataTablePage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: '',
    direction: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadData();
      setData(result);
    };

    if (selectedYear === 'All') {
      fetchData();
    }
  }, [selectedYear]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const filteredData = selectedYear === 'All' ? data : data.filter((item) => item.Year === selectedYear);

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      const accessor = (item: any) => item[sortConfig.key];
      sortableData.sort((a, b) => {
        if (accessor(a) < accessor(b)) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (accessor(a) > accessor(b)) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  return (
    <div>
      <div>
        <label htmlFor="year-select">Select year:</label>
        <select id="year-select" onChange={handleYearChange}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500'>
          <option value="All">All</option>
          <option value="2030">2030</option>
          <option value="2040">2040</option>
          <option value="2050">2050</option>
          <option value="2060">2060</option>
          <option value="2070">2070</option>
        </select>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable data={sortedData} sortConfig={sortConfig} handleSort={handleSort} />
      </Suspense>
    </div>
  );
};

export default DataTablePage;
