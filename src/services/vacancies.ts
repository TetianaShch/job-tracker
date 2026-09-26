import type { Vacancy } from "../types/vacancy";

export async function getVacancies(): Promise<Vacancy[]> {
    const result = await chrome.storage.local.get("vacancies");
    return (result.vacancies as Vacancy[] | undefined) ?? [];
}

export async function saveVacancy(vacancy: Vacancy): Promise<boolean> {
    const vacancies = await getVacancies();

    if (vacancies.some((item) => item.url === vacancy.url)) {
        return false;
    }
    await chrome.storage.local.set({
        vacancies: [...vacancies, vacancy],
    });

    return true;
}

export async function deleteVacancy(id: string): Promise<void> {
    const vacancies = await getVacancies();

    await chrome.storage.local.set({
        vacancies: vacancies.filter((item) => item.id !== id),
    });
}

