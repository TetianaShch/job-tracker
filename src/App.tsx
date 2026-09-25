import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) {
        setTitle(tab?.title ?? "Назва недоступна");
        setUrl(tab?.url ?? "Посилання недоступне");
      }
    });
  }, []);

  return (
    <>
      <section>
        <h1>{title}</h1>
        <p>{url}</p>
      </section>
    </>
  );
}

export default App;
