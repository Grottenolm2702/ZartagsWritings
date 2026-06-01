import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

type Item = { category: string; title: string; to: string };


export default function CampaignOverview() {
  return (
    <Layout>
      <main>
        <h1>Overview</h1>
        <div className="filter-container">
          <input
            type="text"
            className="searchbar"
            placeholder="search entries"
            aria-label="search"
          />
          <div className="filter-buttons">
            <button className="filter-button active" data-category="all">
              All
            </button>
            <button className="filter-button" data-category="Pcs">
              Player Caracter
            </button>
            <button className="filter-button" data-category="Mi">
              Magic Items
            </button>
            <button className="filter-button" data-category="Loc">
              Locations
            </button>
            <button className="filter-button" data-category="Npcs">
              Npcs
            </button>
          </div>
        </div>

        <section className="element-section" data-category="Pcs">
          <h2>Player Caracters</h2>
          <ul className="element-list">
            <li>
              <Link to="/capaign1/pc">Melissa - Fighter - Tiefling</Link>
            </li>
            <li>
              <Link to="#">Ronny - Garten - Zwerg</Link>
            </li>
            <li>
              <Link to="#">Human - Male - Fighter</Link>
            </li>
          </ul>
        </section>

        <section className="element-section" data-category="Npcs">
          <h2>Npcs</h2>
          <ul className="element-list">
            <li>
              <Link to="/capaign1/npc">Zartag</Link>
            </li>
            <li>
              <Link to="#">Irenäus</Link>
            </li>
            <li>
              <Link to="#">Manuel</Link>
            </li>
          </ul>
        </section>

        <section className="element-section" data-category="Mi">
          <h2>Magic Items</h2>
          <ul className="element-list">
            <li>
              <Link to="/capaign1/magicitem">Das Buch</Link>
            </li>
            <li>
              <Link to="#">Warschip</Link>
            </li>
            <li>
              <Link to="#">haus</Link>
            </li>
          </ul>
        </section>

        <section className="element-section" data-category="Loc">
          <h2>Locations</h2>
          <ul className="element-list">
            <li>
              <Link to="#">Elarint</Link>
            </li>
            <li>
              <Link to="/capaign1/location">Das Herrenhaus</Link>
            </li>
            <li>
              <Link to="#">Der Brunnen</Link>
            </li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}
