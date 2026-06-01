import React from "react";
import Layout from "../../components/Layout";

export default function Location() {
  return (
    <Layout>
      <main>
        <h1>Location</h1>
        <div className="content-header">
          <div className="content-header-item">
            <span className="label">Name:</span>
            <span className="value">Das Herrenhaus</span>
          </div>
          <div className="content-header-item">
            <span className="label">Type:</span>
            <span className="value">House</span>
          </div>
        </div>
        <div className="items-grid">
          <div className="items-masonry">
            <div className="item-card">
              <h2>Short Decscription</h2>
              <p>Placeholder description from original HTML.</p>
            </div>
            <div className="item-card">
              <h2>Related Places</h2>
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
            <p>Placeholder notes from original HTML.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}