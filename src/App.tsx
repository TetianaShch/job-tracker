import { useEffect, useState } from "react";
import type { Vacancy, VacancyStatus } from "./types/vacancy";

import {
  getVacancies,
  saveVacancy,
  deleteVacancy,
  updateVacancyStatus,
} from "./services/vacancies";
import "./App.css";

const statusLabels: Record<VacancyStatus, string> = {
  Saved: "Збережено",
  Applied: "Подано",
  Interview: "Інтерв’ю",
  Rejected: "Відхилено",
};

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [search, setSearch] = useState("");

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
      status: "Saved",
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

  async function handleStatusChange(id: string, status: VacancyStatus) {
    await updateVacancyStatus(id, status);
    setVacancies((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  const filteredVacancies = vacancies.filter((item) => {
    const query = search.trim().toLowerCase();

    return (
      item.title.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query)
    );
  });

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
        <button type="submit">Зберегти</button>
        {message && <p role="status">{message}</p>}
      </form>
      <section>
        <h2>Збережені вакансії</h2>
        <input
          type="search"
          placeholder="Пошук за назвою або компанією"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Пошук вакансій"
        />
        {vacancies.length === 0 ? (
          <p>Поки немає збережених вакансій.</p>
        ) : filteredVacancies.length === 0 ? (
          <p>За цим запитом вакансій немає.</p>
        ) : (
          <ul>
            {filteredVacancies.map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
                {item.company && <span> — {item.company}</span>}
                <div className="statusRow">
                  <label htmlFor={`status-${item.id}`}>Статус: </label>
                  <select
                    id={`status-${item.id}`}
                    value={item.status}
                    onChange={(event) =>
                      handleStatusChange(
                        item.id,
                        event.target.value as VacancyStatus,
                      )
                    }
                  >
                    <option value="Saved">{statusLabels.Saved}</option>
                    <option value="Applied">{statusLabels.Applied}</option>
                    <option value="Interview">{statusLabels.Interview}</option>
                    <option value="Rejected">{statusLabels.Rejected}</option>
                  </select>
                </div>
                <button type="button" onClick={() => handleDelete(item.id)}>
                  Видалити
                </button>
                {item.note && <p>Нотатка: {item.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default App;
