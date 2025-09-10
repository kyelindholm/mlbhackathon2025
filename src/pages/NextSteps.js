import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";


export default function NextSteps() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const markdown = sessionStorage.getItem("geminiMarkdown");
    if (markdown) {
      setContent(markdown);
    }
  }, []);


  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt", // points
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40; // margin from edges
    const lineHeight = 14; // space between lines

    // Optional: adjust font size
    doc.setFontSize(12);

    // Split content into lines that fit the page width
    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin);

    let y = margin; // start position

    lines.forEach((line) => {
      // If we're past the bottom margin, create a new page
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin; // reset y for new page
      }

      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save("roadmap.pdf");
  };

  return (
    <div className="items-center">
      <div id="roadmap-content" className="prose max-w-none p-6 bg-white rounded-xl shadow-md [&>p]:ml-2 [&>ul]:ml-4 [&>ol]:ml-4 [&>ul>li>ul]:ml-6 [&>ul>li>ul>li>ul]:ml-8 [&>h2]:mt-8 [&>h2]:ml-0 ">
        <h2 className="font-bold text-xl mb-4 text-center text-gray-800">Strategic Roadmap</h2>
        <hr />
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
      <div className="flex justify-center">
        <button
          onClick={downloadPDF}
          className="px-5 py-2 mt-5 bg-black text-white font-semibold rounded-lg border-2 border-blue-500 shadow-md hover:bg-blue-50 hover:text-black hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition cursor-pointer">
          Download Roadmap as PDF
        </button>
      </div>
    </div>
  );
}
