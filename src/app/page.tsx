import MapPage from '@/pages/map_page'
import DataTablePage from '@/pages/dataTable_page'
import LineGraphPage from '@/pages/lineGraph_page'

export default function Home() {
  return (
    <div>
      <h1 className='font-black	text-xl text-center'>Climate Risk Rating</h1>
    <main className=''>
      <div className="overflow-auto border border-black">
        <MapPage />
      </div>
      <div className="overflow-auto border border-black">
        <h1 className='font-bold	text-lg text-center'>Line Chart</h1>
        <h3 className='font-bold'>
          Select Location, Asset, or Business Category to see Line Chart</h3>
        <LineGraphPage />
      </div>
      <div className="overflow-auto border border-black">
      <h1 className='font-bold	text-lg text-center'>Data Table</h1>
        <DataTablePage />
      </div>
    </main>
    </div>
  )
}
