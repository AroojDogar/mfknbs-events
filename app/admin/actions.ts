"use server";
import { revalidatePath } from "next/cache";

/** Called after the admin saves or deletes so the public pages refresh immediately. */
export async function refreshSite() {
  revalidatePath("/", "layout");
}
