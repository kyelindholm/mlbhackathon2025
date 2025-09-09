import { GoogleGenAI } from "@google/genai";

export default function TestButton2() {
  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_API_KEY });
  const handleClick = async () => {
    console.log("CLICK");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words"
    });
    console.log(response.text);
  };

  return <button onClick={handleClick}>Test gemini</button>;
}
