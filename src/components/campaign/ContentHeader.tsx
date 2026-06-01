import React from "react";

export type HeaderField = { label: string; value: string };

export default function ContentHeader({ fields }: { fields: HeaderField[] }) {
  if (!fields || fields.length === 0) return null;
  return (
    <div className="content-header">
      {fields.map((f, i) => (
        <div className="content-header-item" key={i}>
          <span className="label">{f.label}</span>
          <span className="value">{f.value}</span>
        </div>
      ))}
    </div>
  );
}
