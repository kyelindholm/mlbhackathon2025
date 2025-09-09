import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoadingPage() {
  const phrases = [
    "Gathering reviews from App Store...",
    "Identifying & Grading features...",
    "Crunching numbers...",
    "Almost ready..."
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const navigate = useNavigate();

    useEffect(() => {
        // Change the text every 3 seconds
        const interval = setInterval(() => {
            setCurrentPhraseIndex((prevIndex) => {
            if (prevIndex < phrases.length - 1) {
                return prevIndex + 1;
            } else {
                return prevIndex; // stay on the last phrase
            }
            });
        }, 3000);

        // Redirect after 15 seconds
        const timer = setTimeout(() => {
            navigate("/home"); // replace with your target page
        }, 15000);

        // Cleanup both timer and interval on unmount
        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate, phrases.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 p-6 pb-50">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center mb-12">
 

          {/* Crescent Spinner */}
          <div className="absolute flex items-center justify-center spinner-gradient-crescent animate-spin-slow"></div>
        </div>

        {/* Rotating Text */}
        <div className="text-xl font-medium text-gray-700 mt-8">
          <p>{phrases[currentPhraseIndex]}</p>
        </div>
      </div>

      {/* Custom Tailwind animation */}
      <style jsx>{`
        @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
        animation: spin 2s linear infinite;
        }

        .spinner-gradient-crescent {
        width: 8rem; /* 32 */
        height: 8rem; /* 32 */
        border-radius: 50%;
        border: 4px solid transparent; /* base transparent */
        border-top-color: transparent;
        border-right-color: #1D4ED8; /* blue-600 */
        border-bottom-color: #DC2626; /* red-600 */
        border-left-color: #3B82F6; /* blue-500 for subtle gradient effect */
        background: conic-gradient(#1D4ED8, #DC2626);
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px));
        }
      `}</style>
    </div>
  );
}