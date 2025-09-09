import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ exportSampleCSV }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onNextStepsPage = location.pathname === "/next-steps";

  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 drop-shadow-md">
        Compass
      </h1>
      <div className="flex items-center gap-3">
        {/* Primary action button */}
        <button
          onClick={() => navigate(onNextStepsPage ? "/" : "/next-steps")}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
          title={onNextStepsPage ? "Go Home" : "Generate next steps"}
        >
          {onNextStepsPage ? "Home" : "Next Steps"}
        </button>

        {/* Secondary action button */}
        <button
          onClick={exportSampleCSV}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer"
        >
          Download CSV
        </button>
      </div>
    </header>
  );
}