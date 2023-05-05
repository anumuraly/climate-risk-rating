import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, Column, HeaderGroup, TableCommonProps, TableOptions } from 'react-table';
import { DataItem } from '@/data';

type Props = {
  data: DataItem[];
  selectedYear?: string;
  sortConfig: { key: string; direction: string };
  handleSort: (key: string) => void;
};

const DataTable: React.FC<Props> = ({ data, selectedYear }) => {
  const [searchInput, setSearchInput] = useState('');

  const columns: readonly Column<DataItem>[] = useMemo(
    () => [
      {
        Header: 'Asset Name',
        accessor: 'Asset Name',
      },
      {
        Header: 'Business Category',
        accessor: 'Business Category',
      },
      {
        Header: 'Risk Rating',
        accessor: 'Risk Rating',
      },
      {
        Header: 'Risk Factors',
        accessor: 'Risk Factors',
        
      },
      {
        Header: 'Year',
        accessor: 'Year',
      },
      {
        Header: 'Latitude',
        accessor: 'Lat',
        disableSortBy: true
      },
      {
        Header: 'Longitude',
        accessor: 'Long',
        disableSortBy: true
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    let result = [...data];
    if (selectedYear && selectedYear !== 'All') {
      result = result.filter((item) => item.Year === selectedYear);
    }
    return result;
  }, [data, selectedYear]);
  
  const tableData = useMemo(() => {
    let result = filteredData;
    if (searchInput) {
      result = result.filter((item) => {
        const riskFactors = JSON.parse(item['Risk Factors']);
        return Object.keys(riskFactors).includes(searchInput);
      });
    }
    return result;
  }, [filteredData, searchInput]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<DataItem>(
    {
      columns,
      data: tableData,
    },
    useSortBy
  );

  const headerGroupsTyped = headerGroups as Array<HeaderGroup<DataItem>>;

  return (
    <div>
      <label>Type Risk Factor: </label>
      <input
        type="text"
        placeholder="Search by risk factor"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500'
      />
      <table {...getTableProps()} >
      <thead>
        {headerGroupsTyped.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={i}>
            {headerGroup.headers.map((column: any, j: number) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={j}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, j) => (
                  <td {...cell.getCellProps()} key={j}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
