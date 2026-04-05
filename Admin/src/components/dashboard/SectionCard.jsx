const SectionCard = ({ title, action, children }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action ? <div>{action}</div> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
};

export default SectionCard;
