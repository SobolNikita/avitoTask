import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
      <p className="text-gray-600 mb-8">
        Извините, страница, которую вы ищете, не существует.
      </p>
      <Link
        to="/list"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Вернуться к списку объявлений
      </Link>
    </div>
  )
}

export default NotFoundPage

