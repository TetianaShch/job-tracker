import { useEffect, useState } from "react";
import type { Vacancy, VacancyStatus } from "./types/vacancy";
import VacancyList from "./popup/VacancyList";
import VacancyForm from "./popup/VacancyForm";

import {
  getVacancies,
  saveVacancy,
  deleteVacancy,
  updateVacancyStatus,
} from "./services/vacancies";
import "./App.css";

function App() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [view, setView] = useState<"add" | "list">("add");

  useEffect(() => {
    getVacancies().then(setVacancies);
  }, []);

  async function handleSave(vacancy: Vacancy): Promise<boolean> {
    const saved = await saveVacancy(vacancy);

    if (saved) {
      setVacancies((current) => [...current, vacancy]);
    }

    return saved;
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

  return (
    <>
      {view === "add" ? (
        <>
          <button type="button" onClick={() => setView("list")}>
            Мої вакансії
          </button>
          <VacancyForm onSave={handleSave} />
        </>
      ) : (
        <>
          <button type="button" onClick={() => setView("add")}>
            ← До форми
          </button>
          <VacancyList
            vacancies={vacancies}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </>
  );
}

export default App;
