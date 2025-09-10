import { useNavigate, useLocation } from "react-router-dom";
import SplashHeader from "./SplashHeader";
import { useAppData } from "../pages/AppDataContext";
import { fetchGeminiResponse } from "../Utils";
import compassLogo from '../assets/compass_logo.png';

export default function Header({ exportSampleCSV }) {
  const {appRatings} = useAppData();
  const navigate = useNavigate();
  const location = useLocation();

  const onNextStepsPage = location.pathname === "/next-steps";

  const HandleGenerate = async () => {
    try {
      navigate("/loading2")
      const markdown = await fetchGeminiResponse(appRatings);
      sessionStorage.setItem("geminiMarkdown", markdown);
      navigate("/next-steps");
    } catch (err) {
      console.error("Error fetching Gemini response:", err);
    }
  };

  if (location.pathname === "/" || location.pathname === "/loading1") {
    return <SplashHeader />;
  } else {
    return (
  <header className="flex items-center justify-between mb-6">
        <img src={compassLogo} alt="Compass App Logo " className="h-20 w-auto cursor-pointer" onClick={() => navigate("/home")} />

        <div className="flex items-center gap-3 h-full">
       
          <button
            onClick={() => {
              if (!onNextStepsPage) {
                HandleGenerate();
              } else {
                navigate("/home");
              }
            }}
            className="px-5 py-2 bg-black text-white font-semibold rounded-lg border-2 border-blue-500 shadow-md hover:bg-blue-50 hover:text-black hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
            title={onNextStepsPage ? "Go Home" : "Generate next steps"}
          >
            {onNextStepsPage ? "Home" : "Gemini Analysis & Next Steps"}
          </button>

          <button
            onClick={() => navigate('/loading1')}
            className="px-5 py-2 bg-black text-white font-semibold rounded-lg border-2 border-blue-500 shadow-md hover:bg-blue-50 hover:text-black hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
          >
            Rerun Analysis
          </button>

          <button
            onClick={exportSampleCSV}
            className="px-5 py-2 bg-black text-white font-semibold rounded-lg border-2 border-blue-500 shadow-md hover:bg-blue-50 hover:text-black hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
          >
            Download Data CSV
          </button>
        </div>
      </header>
    );
  }
}