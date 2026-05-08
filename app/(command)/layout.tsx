import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCommandSession } from "@/auth";
import { MobileHeader, Sidebar } from "@/components/command/shell";

export default async function CommandLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getCommandSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <Sidebar user={session.user} />
      <MobileHeader user={session.user} />
      <main className="min-h-screen px-4 py-6 md:ml-72 md:px-8 lg:px-10">{children}</main>
    </>
  );
}
