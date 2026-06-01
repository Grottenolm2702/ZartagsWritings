import type { HeaderField } from "../components/campaign/ContentHeader";
import type { CardSpec } from "../components/campaign/ItemsGrid";

export const PC_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: [
    { label: "Name:", value: "Melissa" },
    { label: "Class:", value: "Fighter" },
    { label: "Race:", value: "Tiefling" },
  ],
  cards: [
    {
      title: "Short Description",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ),
    },
    {
      title: "Backstory",
      content: (
        <p>
          Character backstory content here. Replace with backend content when
          available.
        </p>
      ),
    },
    {
      title: "Picture",
      pictureSrc:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.PIOJ1VrKV0mux7r68o6BjgHaHa%3Fpid%3DApi&f=1&ipt=8db0a96b75aec1cad70144c59e25e2a048a04e4ee38832ea092bb35c6b2a98d2&ipo=images",
    },
    {
      title: "General Notes",
      content: (
        <p>
          Misc notes. Replace with backend content when available.
        </p>
      ),
      wide: true,
    },
  ],
};

export const NPC_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: [
    { label: "Name:", value: "Zartag" },
    { label: "Class:", value: "Wizard" },
    { label: "Race:", value: "Half-Dwarf" },
    { label: "Occupation:", value: "Influencer" },
    { label: "Alignment:", value: "Chaotic Neutral" },
  ],
  cards: [
    {
      title: "Short Description",
      content: (
        <p>
          Zartag is a half-dwarf wizard and the author of Robert's Mageikunde-
          Magazin. He travels frequently.
        </p>
      ),
    },
    {
      title: "Story Points",
      content: (
        <ul>
          <li>Zartag asks the party to escort him home (forest is dangerous)</li>
          <li>
            Zartag reveals the water is magically poisoned and points to the
            well as source.
          </li>
        </ul>
      ),
    },
    {
      title: "Picture",
      pictureSrc: "/src/media/Hero_screenshot.png",
    },
    {
      title: "General Notes",
      content: (
        <p>
          Misc notes. Replace with backend content when available.
        </p>
      ),
      wide: true,
    },
  ],
};

export const MAGICITEM_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: [
    { label: "Name:", value: "Die Unendliche Geschichte" },
    { label: "Type:", value: "Book" },
    { label: "Weight:", value: "???" },
    { label: "Cost:", value: "???" },
    { label: "Quantity:", value: "1" },
  ],
  cards: [
    {
      title: "Magical Attributes",
      content: (
        <dl className="attribute-list">
          <dt>School:</dt>
          <dd>Abduration</dd>
          <dt>Attunement:</dt>
          <dd>None</dd>
        </dl>
      ),
    },
    {
      title: "Effect",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ),
    },
    {
      title: "Picture",
      pictureSrc:
        "https://img.freepik.com/free-vector/book-magic-spells-witchcraft_105738-781.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      title: "General Notes",
      content: (
        <p>
          Misc notes. Replace with backend content when available.
        </p>
      ),
      wide: true,
    },
  ],
};

export const LOCATION_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: [
    { label: "Name:", value: "Das Herrenhaus" },
    { label: "Type:", value: "House" },
  ],
  cards: [
    {
      title: "Short Description",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ),
    },
    {
      title: "Related Places",
      content: (
        <ul>
          <li><a href="#">Garten</a></li>
          <li><a href="#">Keller</a></li>
          <li><a href="#">Küche</a></li>
        </ul>
      ),
    },
    {
      title: "General Notes",
      content: (
        <p>
          Misc notes. Replace with backend content when available.
        </p>
      ),
      wide: true,
    },
  ],
};

