import { useNavigate } from 'react-router-dom';
import logo from '../assets/mlblogo.png';

export default function Splash() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/loading1');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 pt-40">
      {/* Logo */}
      <img src={logo} alt="MLB Logo" className="w-130 h-80" />

      {/* Button */}
      <button
        onClick={handleClick}
        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
      >
        Run Competitor Analysis
      </button>
    </div>
  );
}