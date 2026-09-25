export type VacancyStatus = "Saved" | "Applied" | "Interview" | "Rejected";


export type Vacancy = {
    id: string;
    title: string;
    company: string;
    url: string;
    note: string;
    status: VacancyStatus;
    createdAt: string;
};



