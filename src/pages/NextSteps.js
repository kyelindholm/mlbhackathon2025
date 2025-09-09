import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NextSteps() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const markdown = sessionStorage.getItem("geminiMarkdown");
    if (markdown) {
      setContent(markdown);
    }
  }, []);

  return (
    <div className="prose max-w-none p-6 bg-white rounded-xl shadow-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
