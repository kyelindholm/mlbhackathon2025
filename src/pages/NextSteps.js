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
    <div className="prose max-w-none p-6 bg-white rounded-xl shadow-md [&>p]:ml-2 [&>ul]:ml-4 [&>ol]:ml-4 [&>ul>li>ul]:ml-6 [&>ul>li>ul>li>ul]:ml-8 [&>h2]:mt-8 [&>h2]:ml-0 ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
