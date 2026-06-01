import React from 'react'
import Header from '../components/Header'

export default function CampaignOverview() {
  return (
    <>
      <Header />
      <main>
        <h1>Overview</h1>
        <div className="filter-container">
          <input type="text" className="searchbar" placeholder="search entries" aria-label="search" />
          <div className="filter-buttons">
            <button className="filter-button active" data-category="all">All</button>
            <button className="filter-button" data-category="Pcs">Player Caracter</button>
            <button className="filter-button" data-category="Mi">Magic Items</button>
            <button className="filter-button" data-category="Loc">Locations</button>
            <button className="filter-button" data-category="Npcs">Npcs</button>
          </div>
        </div>

        <section className="element-section" data-category="Pcs">
          <h2>Player Caracters</h2>
          <ul className="element-list">
            <li><a href="/capaign1/pc">Melissa - Fighter - Tiefling</a></li>
            <li><a href="#">Ronny - Garten - Zwerg</a></li>
            <li><a href="#">Human - Male - Fighter</a></li>
          </ul>
        </section>

        <section className="element-section" data-category="Npcs">
          <h2>Npcs</h2>
          <ul className="element-list">
            <li><a href="/capaign1/npc">Zartag</a></li>
            <li><a href="#">Irenäus</a></li>
            <li><a href="#">Manuel</a></li>
          </ul>
        </section>

        <section className="element-section" data-category="Mi">
          <h2>Magic Items</h2>
          <ul className="element-list">
            <li><a href="/capaign1/magicitem">Das Buch</a></li>
            <li><a href="#">Warschip</a></li>
            <li><a href="#">haus</a></li>
          </ul>
        </section>

        <section className="element-section" data-category="Loc">
          <h2>Locations</h2>
          <ul className="element-list">
            <li><a href="#">Elarint</a></li>
            <li><a href="/capaign1/location">Das Herrenhaus</a></li>
            <li><a href="#">Der Brunnen</a></li>
          </ul>
        </section>
      </main>
    </>
  )
}
