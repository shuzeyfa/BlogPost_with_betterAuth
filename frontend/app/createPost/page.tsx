import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import CreatePostClient from "./CreatePostClient"

export default async function CreatePostPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <CreatePostClient session={session} />;
}
