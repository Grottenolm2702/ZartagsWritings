import React from 'react'
import Layout from '../components/Layout'

export default function CampaignOverview() {
  return (
    <Layout>
      <main>
        <h1>Overview</h1>
        <div className="filter-container">
          <input type="text" className="searchbar" placeholder="search entries" aria-label="search" />
        </div>
        <section className="element-section" data-category="Pcs">
          <h2>Player Caracters</h2>
          <ul className="element-list">
            <li><a href="/capaign1/pc">Melissa - Fighter - Tiefling</a></li>
          </ul>
        </section>
      </main>
    </Layout>
  )
}
