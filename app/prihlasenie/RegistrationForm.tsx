import { registerChildForCourse } from "./actions";

type RegistrationFormProps = {
  childId: string;
  courseTermId: string;
};

export default function RegistrationForm({
  childId,
  courseTermId,
}: RegistrationFormProps) {
  return (
    <form action={registerChildForCourse}>
      <input type="hidden" name="childId" value={childId} />

      <input type="hidden" name="courseTermId" value={courseTermId} />

      <button
        type="submit"
        className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
      >
        Potvrdiť prihlášku
      </button>
    </form>
  );
}
