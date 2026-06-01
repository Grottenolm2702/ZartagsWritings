import React from "react";
import { useAuth } from "../../context/AuthContext";

export type HeaderField = { label: string; value: string };

export default function ContentHeader({ fields, onChange }: { fields: HeaderField[]; onChange?: (idx: number, updated: HeaderField) => void }) {
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return { isEditor: false } as any;
    }
  })();

  if (!fields || fields.length === 0) return null;
  return (
    <div className="content-header">
      {fields.map((f, i) => (
        <div className="content-header-item" key={i}>
          <span className="label">{f.label}</span>
          {auth.isEditor ? (
            <input
              value={f.value}
              className="value"
              style={{ border: "none", background: "transparent", textAlign: "center", width: "100%" }}
              onChange={(e) => onChange && onChange(i, { ...f, value: e.target.value })}
            />
          ) : (
            <span className="value">{f.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
