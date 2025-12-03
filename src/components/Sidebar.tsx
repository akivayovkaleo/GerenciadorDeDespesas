import Link from 'next/link';
import { FiTrendingUp, FiList } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col h-screen sticky top-0">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600 border-b-2 border-yellow-600 pb-4">
        Mercearia
      </h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link
              href="/despesas"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold hover:bg-yellow-600 hover:text-blue-900 transition-all duration-200"
            >
              <FiList size={20} />
              Gerenciador
            </Link>
          </li>

          <li>
            <Link
              href="/receitas"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold hover:bg-yellow-600 hover:text-blue-900 transition-all duration-200"
            >
              <FiTrendingUp size={20} />
              Receitas
            </Link>
          </li>

          <li>
            <Link
              href="/despesas-pendentes"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold hover:bg-yellow-600 hover:text-blue-900 transition-all duration-200"
            >
              <FiTrendingUp size={20} />
              Despesas a Pagar
            </Link>
          </li>

          <li>
            <Link
              href="/graficos"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-semibold hover:bg-yellow-600 hover:text-blue-900 transition-all duration-200"
            >
              <FiTrendingUp size={20} />
              Gráficos
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-yellow-600 pt-4">
        <p className="text-xs text-gray-300">v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
