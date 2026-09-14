interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-300 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="w-1.5 h-9 rounded-full bg-[#0052FF] shrink-0 mt-0.5" />
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
