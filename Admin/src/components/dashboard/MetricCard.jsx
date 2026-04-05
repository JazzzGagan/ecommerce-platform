const TONE_CLASSES = {
  blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
  emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
  violet: "from-violet-50 to-violet-100 border-violet-200 text-violet-700",
  amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-700",
  rose: "from-rose-50 to-rose-100 border-rose-200 text-rose-700",
};

const MetricCard = ({ title, value, subtitle, tone = "blue" }) => {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.blue;

  return (
    <article
      className={`rounded-xl border bg-linear-to-br p-4 shadow-sm ${toneClass}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle ? (
        <p className="mt-1 text-xs text-gray-600">{subtitle}</p>
      ) : null}
    </article>
  );
};

export default MetricCard;
