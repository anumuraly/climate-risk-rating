"use client";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { loadData, DataItem } from '@/data';

const LineGraph = lazy(() => import('@/components/lineGraph'));

const LineGraphPage = () => {
  const [selectedOption, setSelectedOption] = useState<'location' | 'asset' | 'category'>('location');
  const [locations, setLocations] = useState<DataItem[]>([]);
  const [assets, setAssets] = useState<DataItem[]>([]);
  const [categories, setCategories] = useState<DataItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData().then((data) => {
      setLocations(data.filter((item) => !!item.Lat && !!item.Long));
      setAssets(data.filter((item) => !!item['Asset Name']));
      setCategories(data.filter((item) => !!item['Business Category']));
    });
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption('location');
    setSelectedLocation(e.target.value);
    setSelectedAsset('');
    setSelectedCategory('');
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption('asset');
    setSelectedAsset(e.target.value);
    setSelectedLocation('');
    setSelectedCategory('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption('category');
    setSelectedCategory(e.target.value);
    setSelectedLocation('');
    setSelectedAsset('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="location">Location</label>
          <select name="location" value={selectedLocation} onChange={handleLocationChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500'>
            <option value="">Select a location</option>
            {locations.map((item) => (
              <option key={item.Lat + item.Long} value={`${item.Lat},${item.Long}`}>
                {item.Lat}, {item.Long}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="asset">Asset</label>
          <select name="asset" value={selectedAsset} onChange={handleAssetChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500'>
            <option value="">Select an asset</option>
            {assets.map((item) => (
              <option key={item['Asset Name']} value={item['Asset Name']}>
                {item['Asset Name']}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category">Business Category</label>
          <select name="category" value={selectedCategory} onChange={handleCategoryChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500'>
            <option value="">Select a category</option>
            {categories.map((item) => (
              <option key={item['Business Category']} value={item['Business Category']}>
                {item['Business Category']}
              </option>
            ))}
          </select>
        </div>
      </form>
      {selectedOption === 'location' && selectedLocation && (
        <Suspense fallback={<div>Loading...</div>}>
          <LineGraph lat={selectedLocation.split(',')[0]} long={selectedLocation.split(',')[1]} />
        </Suspense>
      )}
      {selectedOption === 'asset' && selectedAsset && (
        <Suspense fallback={<div>Loading...</div>}>
          <LineGraph assetName={selectedAsset} />
        </Suspense>
      )}
      {selectedOption === 'category' && selectedCategory && (
        <Suspense fallback={<div>Loading...</div>}>
          <LineGraph businessCategory={selectedCategory} />
        </Suspense>
      )}
     
    </div>
  );
};

export default LineGraphPage;