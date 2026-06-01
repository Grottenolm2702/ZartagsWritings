import React from "react";
import Layout from "../../components/Layout";

export default function NPC() {
  return (
    <Layout>
      <main>
        <h1>Non Playable Caracter</h1>
        <div className="content-header">
          <div className="content-header-item">
            <span className="label">Name:</span>
            <span className="value">Zartag</span>
          </div>
          <div className="content-header-item">
            <span className="label">Class:</span>
            <span className="value">Wizard</span>
          </div>
          <div className="content-header-item">
            <span className="label">Race:</span>
            <span className="value">Half-Dwarf</span>
          </div>
          <div className="content-header-item">
            <span className="label">Occupation:</span>
            <span className="value">influencer</span>
          </div>
          <div className="content-header-item">
            <span className="label">Alignment:</span>
            <span className="value">Chaotic Neutral</span>
          </div>
        </div>
        <div className="items-grid">
          <div className="items-masonry">
            <div className="item-card">
              <h2>Short Decscription</h2>
              <p>
                Zartag is a half-dwarf wizard and the author of Robert's
                Mageikunde-Magazin. He sends daily letters to everyone who has
                ever taken a card from him, describing his day and showcasing
                new magical tools—even if they ask him to stop.
              </p>
            </div>
            <div className="item-card">
              <h2>Story Points</h2>
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
            </div>
            <div className="item-card">
              <h2>Picture</h2>
              <img
                src="/src/media/Hero_screenshot.png"
                alt="Character Picture"
              />
            </div>
          </div>
          <div className="item-card wide">
            <h2>Generell Notes</h2>
            <p>Placeholder notes.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}