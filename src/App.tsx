export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          TrOps 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Si c'est beau et centré, c'est que Tailwind fonctionne parfaitement !
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Commencer
        </button>
      </div>
    </div>
  );
}