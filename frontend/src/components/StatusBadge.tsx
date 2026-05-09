interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const classes =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : status === "Suspended"
      ? "bg-amber-50 text-amber-700 ring-amber-600/20"
      : "bg-rose-50 text-rose-700 ring-rose-600/20";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${classes}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}