import { useState } from "react";

type EditVacancyFormProps = {
  note: string;
  onSave: (note: string) => Promise<void>;
};

function EditVacancyForm({ note, onSave }: EditVacancyFormProps) {
  const [noteText, setNoteText] = useState(note);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(noteText);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="editNote">Нотатка</label>
      <textarea
        id="editNote"
        value={noteText}
        onChange={(event) => setNoteText(event.target.value)}
      />
      <button type="submit">Зберегти</button>
    </form>
  );
}

export default EditVacancyForm;
