import type { ReactNode } from "react"

interface AdminHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
    </div>
  )
}
