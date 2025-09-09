import { useNavigate, useLocation } from "react-router-dom";
import SplashHeader from "./SplashHeader";
import { useAppData } from "../pages/AppDataContext";
import { fetchGeminiResponse } from "../Utils";

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
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 drop-shadow-md">
          Compass
        </h1>
        <div className="flex items-center gap-3">
       
          <button
            onClick={() => {
              if (!onNextStepsPage) {
                HandleGenerate();
              } else {
                navigate("/home");
              }
            }}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
            title={onNextStepsPage ? "Go Home" : "Generate next steps"}
          >
            {onNextStepsPage ? "Home" : "AI Analysis & Next Steps"}
          </button>

          <button
            onClick={() => navigate('/loading1')}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
          > 
            Rerun Analysis
          </button>

           <button
            onClick={exportSampleCSV}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
          >
            Download CSV
          </button>
        </div>
      </header>
    );
  }
}