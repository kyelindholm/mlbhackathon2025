import { buildAppData } from "../Utils";

export default function TestFetchButton() {
  const handleClick = async () => {
    try {
      const data = await buildAppData();
      console.log("Fetched data:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleClick}>Fetch Sheet Data</button>;
}