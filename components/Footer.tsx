import React from 'react';
import { BarChart3 } from 'lucide-react';

interface FooterProps {
  onStatsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onStatsClick }) => {
  return (
    <footer className="w-full py-6 mt-auto bg-chrono-900 text-chrono-300 text-center text-sm border-t border-chrono-700 flex flex-col items-center gap-2">
      <p>Aitor Sánchez Gutiérrez - © 2025 Todos los derechos reservados</p>
      <button 
        onClick={onStatsClick}
        className="text-chrono-700 hover:text-chrono-500 transition-colors p-1"
        title="Ver Estadísticas"
      >
        <BarChart3 className="w-4 h-4" />
      </button>
    </footer>
  );
};

export default Footer;