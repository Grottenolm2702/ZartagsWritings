import React from "react";
import { useAuthSafe } from "../../context/AuthContext";
import contentStyles from "../../styles/content.module.css";
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
    <div className={contentStyles.contentHeader}>
      {fields.map((f, i) => (
        <div className={contentStyles.contentHeaderItem} key={i}>
          <span className={contentStyles.label}>{f.label}</span>
          {auth.isEditor ? (
            <input
              value={f.value}
              className={contentStyles.value}
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
            <span className={contentStyles.value}>{f.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
