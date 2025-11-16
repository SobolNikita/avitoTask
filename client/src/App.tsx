import { Routes, Route, Navigate } from 'react-router-dom'
import ListPage from './pages/ListPage'
import ItemPage from './pages/ItemPage'
import StatsPage from './pages/StatsPage'
import NotFoundPage from './pages/NotFoundPage'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/list" element={<ListPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
