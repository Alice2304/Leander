import SocialFeed from "@/components/social-feed"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        <SocialFeed />
      </div>
    </main>
  )
}