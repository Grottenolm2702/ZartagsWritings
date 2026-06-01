import React from "react";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";

export default function MagicItem() {
  const header = [
    { label: "Name:", value: "Die Unendliche Geschichte" },
    { label: "Type:", value: "Book" },
    { label: "Weight:", value: "???" },
    { label: "Cost:", value: "???" },
    { label: "Quantity:", value: "1" },
  ];

  const cards = [
    {
      title: "Magical Atributes",
      content: (
        <dl className="atribute-list">
          <dt>School:</dt>
          <dd>Abduration</dd>
          <dt>Attunment:</dt>
          <dd>None</dd>
        </dl>
      ),
    },
    {
      title: "Effect",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
      ),
    },
    {
      title: "Picture",
      pictureSrc:
        "https://img.freepik.com/free-vector/book-magic-spells-witchcraft_105738-781.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      title: "Generell Notes",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      ),
      wide: true,
    },
  ];

  return (
    <Layout>
      <CampaignDetail title="Magic Item" headerFields={header} cards={cards} />
    </Layout>
  );
}
