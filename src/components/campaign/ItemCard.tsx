import React from "react";

export default function ItemCard({
  title,
  children,
  pictureSrc,
  pictureAlt,
  wide,
}: {
  title: string;
  children?: React.ReactNode;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
}) {
  return (
    <div className={"item-card" + (wide ? " wide" : "")}>
      <h2>{title}</h2>
      {children}
      {pictureSrc ? (
        <div className="item-picture">
          <img src={pictureSrc} alt={pictureAlt || title} />
        </div>
      ) : null}
    </div>
  );
}
