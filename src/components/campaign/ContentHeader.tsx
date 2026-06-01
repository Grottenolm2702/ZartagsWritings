import React from "react";
import { useAuthSafe } from "../../context/AuthContext";
import type { HeaderField } from "../../types/campaign";

export type { HeaderField };

export default function ContentHeader({
  fields,
  onChange,
}: {
  fields: HeaderField[];
  onChange?: (idx: number, updated: HeaderField) => void;
}) {
  const auth = useAuthSafe();

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
              style={{
                border: "none",
                background: "transparent",
                textAlign: "center",
                width: "100%",
              }}
              onChange={(e) =>
                onChange && onChange(i, { ...f, value: e.target.value })
              }
            />
          ) : (
            <span className="value">{f.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
