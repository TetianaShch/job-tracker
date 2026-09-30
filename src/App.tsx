import { useEffect, useState } from "react";
import type { Vacancy, VacancyStatus } from "./types/vacancy";
import VacancyList from "./popup/VacancyList";
import VacancyForm from "./popup/VacancyForm";

import {
  getVacancies,
  saveVacancy,
  deleteVacancy,
  updateVacancyStatus,
  updateVacancyInterviewAt,
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
    const updatedVacancies = await updateVacancyStatus(id, status);
    setVacancies(updatedVacancies);
  }

  async function handleInterviewAtChange(id: string, interviewAt: string) {
    const updatedVacancies = await updateVacancyInterviewAt(id, interviewAt);
    setVacancies(updatedVacancies);
  }

  return (
    <>
      {view === "add" ? (
        <>
          <button
            className="openVacanciesButton"
            type="button"
            onClick={() => setView("list")}
          >
            Переглянути вакансії →
          </button>
          <VacancyForm onSave={handleSave} />
        </>
      ) : (
        <>
          <button
            className="backToFormButton"
            type="button"
            onClick={() => setView("add")}
          >
            ← До форми
          </button>
          <VacancyList
            vacancies={vacancies}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onInterviewAtChange={handleInterviewAtChange}
          />
        </>
      )}
    </>
  );
}

export default App;
