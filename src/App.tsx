import { useEffect, useState } from "react";
import type { Vacancy, VacancyStatus } from "./types/vacancy";
import { getVacancies, saveVacancy, deleteVacancy } from "./services/vacancies";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<VacancyStatus>("Saved");
  const [message, setMessage] = useState("");
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    getVacancies().then(setVacancies);
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) {
        setTitle(tab?.title ?? "Назва недоступна");
        setUrl(tab?.url ?? "");
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
      status,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveVacancy(vacancy);

    if (saved) {
      setVacancies((current) => [...current, vacancy]);
    }

    setMessage(saved ? "Вакансію збережено" : "Цю вакансію вже збережено");
  }

  async function handleDelete(id: string) {
    await deleteVacancy(id);
    setVacancies((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
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
        <button type="submit">Зберегти</button>
        {message && <p role="status">{message}</p>}
      </form>
      <section>
        <h2>Збережені вакансії</h2>
        {vacancies.length === 0 ? (
          <p>Поки немає збережених вакансій.</p>
        ) : (
          <ul>
            {vacancies.map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
                {item.company && <span> — {item.company}</span>}
                <button type="button" onClick={() => handleDelete(item.id)}>
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default App;
