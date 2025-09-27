import { Nav } from "@/components/nav"
import { DemoAnnouncementPanel } from "@/components/announcement/demo-panel"

export default function Page() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-balance text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-(--color-muted-foreground)">
          The "Dashboard Welcome" announcement is configured to show here. Try it now.
        </p>
        <div className="mt-6">
          <DemoAnnouncementPanel />
        </div>
      </section>
    </main>
  )
}
