import { Navbar } from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-slate-50 py-12 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Dashboard KAKAP - Monitoring Pelabuhan Perikanan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
