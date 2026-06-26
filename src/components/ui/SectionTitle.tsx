import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<Props> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="text-slate-500 text-sm mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;