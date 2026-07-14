export function LoadingSpinner({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
      <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
      <p className="text-label-md">{label}</p>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 flex items-center gap-2 text-label-md">
      <span className="material-symbols-outlined">error</span>
      {message}
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
      <p className="text-label-md font-bold text-on-surface">{title}</p>
      <p className="text-body-md text-on-surface-variant max-w-sm">{description}</p>
    </div>
  );
}
