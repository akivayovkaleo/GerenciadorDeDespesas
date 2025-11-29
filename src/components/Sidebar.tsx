import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-azul-mercearia text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-amarelo-queimado">Mercearia do Pai</h1>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/" className="block py-2 px-4 rounded-md text-lg font-bold hover:bg-white hover:text-azul-mercearia transition-colors duration-200">
              Cálculo de Médias
            </Link>
          </li>
          <li>
            <Link href="/despesas" className="block py-2 px-4 rounded-md text-lg font-bold hover:bg-white hover:text-azul-mercearia transition-colors duration-200">
              Gerenciador de Despesas
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
