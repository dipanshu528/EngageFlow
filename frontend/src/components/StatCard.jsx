const StatCard = ({
  title,
  value,
  description
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-slate-800 mt-2">
        {value}
      </h3>

      <p className="text-xs text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );
};

export default StatCard;