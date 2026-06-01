import React from "react";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";

export default function PC() {
  const header = [
    { label: "Name:", value: "Melissa" },
    { label: "Class:", value: "Fighter" },
    { label: "Race:", value: "Tiefling" },
  ];

  const cards = [
    {
      title: "Short Decscription",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      ),
    },
    {
      title: "Backstorry",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      ),
    },
    {
      title: "Picture",
      pictureSrc:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.PIOJ1VrKV0mux7r68o6BjgHaHa%3Fpid%3DApi&f=1&ipt=8db0a96b75aec1cad70144c59e25e2a048a04e4ee38832ea092bb35c6b2a98d2&ipo=images",
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
      <CampaignDetail title="Player Character" headerFields={header} cards={cards} />
    </Layout>
  );
}
