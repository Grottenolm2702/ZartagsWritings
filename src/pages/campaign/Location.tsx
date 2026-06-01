import React from "react";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";

export default function Location() {
  const header = [
    { label: "Name:", value: "Das Herrenhaus" },
    { label: "Type:", value: "House" },
  ];

  const cards = [
    {
      title: "Short Decscription",
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
      title: "Related Places",
      content: (
        <ul>
          <li>
            <a href="#">Garten</a>
          </li>
          <li>
            <a href="#">Keller</a>
          </li>
          <li>
            <a href="#">Küche</a>
          </li>
        </ul>
      ),
    },
    // no picture by default — optional
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
      <CampaignDetail title="Location" headerFields={header} cards={cards} />
    </Layout>
  );
}
