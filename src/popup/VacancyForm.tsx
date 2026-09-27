import { useEffect, useState } from "react";
import type { Vacancy } from "../types/vacancy";

type VacancyFormProps = {
  onSave: (vacancy: Vacancy) => Promise<boolean>;
};

function VacancyForm({ onSave }: VacancyFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) {
        setTitle(tab.title ?? "Назва недоступна");
        setUrl(tab.url ?? "");
      }
    });
  }, []);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const vacancy: Vacancy = {
      id: crypto.randomUUID(),
      title: title.trim(),
      company: company.trim(),
      url: url.trim(),
      note: note.trim(),
      status: "Saved",
      createdAt: new Date().toISOString(),
    };

    const saved = await onSave(vacancy);
    setMessage(saved ? "Вакансію збережено" : "Цю вакансію вже збережено");
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Зберегти</button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default VacancyForm;
