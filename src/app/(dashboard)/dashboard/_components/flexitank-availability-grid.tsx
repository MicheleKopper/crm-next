function SizeCard({
  size,
  available,
  expected,
}: {
  size: string;
  available: number;
  expected: number;
}) {
  return (
    <div className="rounded-lg border border-navy-100 bg-navy-50/40 p-3 text-center">
      <span className="inline-flex rounded-full bg-status-lead/10 px-2.5 py-0.5 text-xs font-bold text-status-lead">
        {size}
      </span>
      <p className="mt-2.5 text-xl font-bold text-status-ativo">{available}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-400">
        Disponível
      </p>
      <hr className="my-2 border-navy-100" />
      <p className="text-xl font-bold text-navy-500">{expected}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-400">
        Esperado
      </p>
    </div>
  );
}

export function FlexitankAvailabilityGrid({
  sizes,
  available,
  expected,
}: {
  sizes: string[];
  available: Record<string, number>;
  expected: Record<string, number>;
}) {
  if (sizes.length === 0) {
    return (
      <p className="text-sm text-navy-400">Nenhum flexitank disponível ou esperado.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {sizes.map((size) => (
        <SizeCard key={size} size={size} available={available[size]} expected={expected[size]} />
      ))}
    </div>
  );
}
