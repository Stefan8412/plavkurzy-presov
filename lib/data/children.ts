import { createClient } from "@/lib/supabase/server";

export type Child = {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | null;
  notes: string | null;
};

export async function getChildren(): Promise<Child[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("children")
    .select(
      `
      id,
      parent_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      notes
    `,
    )
    .eq("parent_id", user.id)
    .order("first_name");

  if (error) {
    console.error("Failed to fetch children:", error);
    throw new Error("Failed to fetch children");
  }

  return (data ?? []).map((child) => ({
    id: child.id,
    parentId: child.parent_id,
    firstName: child.first_name,
    lastName: child.last_name,
    dateOfBirth: child.date_of_birth,
    gender: child.gender,
    notes: child.notes,
  }));
}
