import { useState } from "react";
import type { Vacancy, VacancyStatus } from "../types/vacancy";

type VacancyListProps = {
  vacancies: Vacancy[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: VacancyStatus) => void;
};

const statusLabels: Record<VacancyStatus, string> = {
  Saved: "Збережено",
  Applied: "Подано",
  Interview: "Інтерв’ю",
  Rejected: "Відхилено",
};

function VacancyList({
  vacancies,
  onDelete,
  onStatusChange,
}: VacancyListProps) {
  const [search, setSearch] = useState("");

  const filteredVacancies = vacancies.filter((item) => {
    const query = search.trim().toLowerCase();

    return (
      item.title.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query)
    );
  });

  return (
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

              {item.company && <p>Компанія: {item.company}</p>}

              <div className="statusRow">
                <label htmlFor={`status-${item.id}`}>Статус: </label>
                <select
                  id={`status-${item.id}`}
                  value={item.status}
                  onChange={(event) =>
                    onStatusChange(item.id, event.target.value as VacancyStatus)
                  }
                >
                  <option value="Saved">{statusLabels.Saved}</option>
                  <option value="Applied">{statusLabels.Applied}</option>
                  <option value="Interview">{statusLabels.Interview}</option>
                  <option value="Rejected">{statusLabels.Rejected}</option>
                </select>
              </div>
              {item.status === "Saved" && (
                <p>
                  Збережено:{" "}
                  {new Date(item.createdAt).toLocaleDateString("uk-UA")}
                </p>
              )}
              {item.status === "Applied" && item.appliedAt && (
                <p>
                  Подано: {new Date(item.appliedAt).toLocaleDateString("uk-UA")}
                </p>
              )}
              {item.note && <p>Нотатка: {item.note}</p>}
              <button
                className="deleteVacancyButton"
                type="button"
                onClick={() => onDelete(item.id)}
              >
                Видалити
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default VacancyList;
