function fmt(time?: string | null) {
  if (!time) return '—';
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function FlightTimeDisplay({
  scheduled,
  estimated,
  actual,
  delay,
  label,
}: {
  scheduled: string;
  estimated?: string | null;
  actual?: string | null;
  delay?: number | null;
  label: string;
}) {
  const delayed = (delay ?? 0) > 0;
  return (
    <div className="text-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={delayed ? 'line-through text-slate-400' : ''}>{fmt(scheduled)}</p>
      {delayed && <p className="text-orange-600">{fmt(estimated)}</p>}
      {actual && <p className="text-green-600">✓ {fmt(actual)}</p>}
      {delayed && <span className="inline-block rounded bg-red-100 px-2 text-xs text-red-700">+{delay} min</span>}
    </div>
  );
}
