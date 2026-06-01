import React from "react";
import Layout from "../../components/Layout";

export default function PC() {
  return (
    <Layout>
      <main>
        <h1>Player Character</h1>
        <div className="content-header">
          <div className="content-header-item">
            <span className="label">Name:</span>
            <span className="value">Melissa</span>
          </div>
          <div className="content-header-item">
            <span className="label">Class:</span>
            <span className="value">Fighter</span>
          </div>
          <div className="content-header-item">
            <span className="label">Race:</span>
            <span className="value">Tiefling</span>
          </div>
        </div>
        <div className="items-grid">
          <div className="items-masonry">
            <div className="item-card">
              <h2>Short Decscription</h2>
              <p>Placeholder description.</p>
            </div>
            <div className="item-card">
              <h2>Backstory</h2>
              <p>Placeholder backstory.</p>
            </div>
            <div className="item-card">
              <h2>Picture</h2>
              <img
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.PIOJ1VrKV0mux7r68o6BjgHaHa%3Fpid%3DApi&f=1&ipt=8db0a96b75aec1cad70144c59e25e2a048a04e4ee38832ea092bb35c6b2a98d2&ipo=images"
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
