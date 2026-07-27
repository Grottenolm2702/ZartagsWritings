import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContentHeader from "./ContentHeader";
import type { ApiHeaderField } from "../../types/campaign-api";

test("lets the first header field label and value be edited continuously", () => {
  function Wrapper() {
    const [fields, setFields] = React.useState<ApiHeaderField[]>([
      { label: "Name:", value: "Villain" },
      { label: "Type:", value: "NPC" },
    ]);

    return (
      <ContentHeader
        fields={fields}
        editable={true}
        onChange={(index, updated) =>
          setFields((current) => current.map((field, fieldIndex) => (fieldIndex === index ? updated : field)))
        }
      />
    );
  }

  render(<Wrapper />);

  const firstLabel = screen.getByLabelText("Header field 1 label");
  fireEvent.change(firstLabel, { target: { value: "Character Name:" } });
  fireEvent.change(firstLabel, { target: { value: "Character Name Updated:" } });

  expect(firstLabel).toHaveValue("Character Name Updated:");
});
