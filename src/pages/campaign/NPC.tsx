import React from "react";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";

export default function NPC() {
  const header = [
    { label: "Name:", value: "Zartag" },
    { label: "Class:", value: "Wizard" },
    { label: "Race:", value: "Half-Dwarf" },
    { label: "Occupation:", value: "influencer" },
    { label: "Alignment:", value: "Caotic Neutral" },
  ];

  const cards = [
    {
      title: "Short Decscription",
      content: (
        <p>
          Zartag is a half-dwarf wizard and the author of Robert's
          Mageikunde-Magazin. He sends daily letters to everyone who has
          ever taken a card from him, describing his day and showcasing new
          magical tools—even if they ask him to stop.He lives in a magical
          hut in the woods, which is filled to the brim with mostly useless
          magical items. However, he is rarely home, as he spends most of
          his time traveling the world and visiting every convention he can
          find.
        </p>
      ),
    },
    {
      title: "Story Points",
      content: (
        <ul>
          <li>
            Zartag asks the party to escort him home(the forest is to
            dangerous)
          </li>
          <li>
            Zartag tells the party that the water is magicaly poisond and
            that you can acsses the source through the well.
          </li>
        </ul>
      ),
    },
    {
      title: "Picture",
      pictureSrc: "/src/media/Hero_screenshot.png",
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
      <CampaignDetail title="Non Playable Caracter" headerFields={header} cards={cards} />
    </Layout>
  );
}
