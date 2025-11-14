import { useParams } from 'react-router-dom'

function ItemPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Детали объявления</h1>
      <p className="text-gray-600">ID объявления: {id}</p>
      <p className="text-gray-600 mt-4">Страница детального просмотра</p>
    </div>
  )
}

export default ItemPage

