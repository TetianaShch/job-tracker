import { useEffect, useState } from "react";
import type { VacancyStatus } from "./types/vacancy";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<VacancyStatus>("Saved");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) {
        setTitle(tab?.title ?? "Назва недоступна");
        setUrl(tab?.url ?? "");
      }
    });
  }, []);

  return (
    <>
      <form>
        <label htmlFor="title">Назва вакансії</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <label htmlFor="url">Посилання</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />
        <label htmlFor="company">Компанія</label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
        <label htmlFor="note">Нотатка</label>
        <textarea
          id="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <label htmlFor="status">Статус</label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as VacancyStatus)}
        >
          <option value="Saved">Збережено</option>
          <option value="Applied">Подано</option>
          <option value="Rejected">Відхилено</option>
          <option value="Interview">Інтерв'ю</option>
        </select>
        <button type="submit" disabled>
          Зберегти
        </button>
      </form>
    </>
  );
}

export default App;
