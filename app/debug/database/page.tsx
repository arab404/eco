import { DatabaseDebug } from "@/components/database-debug"

export default function DatabaseDebugPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Database Debug</h1>
      <DatabaseDebug />
    </div>
  )
}
