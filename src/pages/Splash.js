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
      <img src={logo} alt="MLB Logo" className="w-250 h-70 m-10" />

      {/* Button */}
      <button
        onClick={handleClick}
        className="mt-10 px-10 py-4 bg-black text-white font-semibold rounded-lg border-2 border-blue-500 shadow-md hover:bg-blue-50 hover:text-black hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
      >
        Run Competitor Analysis
      </button>
    </div>
  );
}