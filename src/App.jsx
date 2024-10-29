import { Routes, Route } from 'react-router-dom'
import SideBar from './components/SideBar';
import CategoryPage from './Pages/CategoryPage';
import ProductsPage from './Pages/ProductsPage';
import ColorPage from './Pages/ColorPage';

function App() {
  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>

      <div className='fixed inset-0 z-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
        <div className='absolute inset-0 backdrop-blur-sm' />
      </div>

      <SideBar />
      <Routes>
        <Route path='/' element={<CategoryPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/colors' element={<ColorPage />} />
      </Routes>
    </div>
  )
}

export default App;