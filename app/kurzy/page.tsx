import CourseCard from "@/components/courses/CourseCard";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { courses } from "@/data/courses";

export default function CoursesPage() {
  return (
    <main>
      <section className="bg-sky-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Naša ponuka"
            title="Vyberte si plavecký kurz"
            description="Vyberte kurz podľa veku, skúseností a potrieb vášho dieťaťa."
          />
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Section>
    </main>
  );
}
