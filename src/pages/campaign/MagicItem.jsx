import React from 'react'
import Header from '../../components/Header'

export default function MagicItem() {
  return (
    <>
      <Header />
      <main>
        <h1>Magic Item</h1>
        <div className="content-header">
          <div className="content-header-item"><span className="label">Name:</span><span className="value">Die Unendliche Geschichte</span></div>
          <div className="content-header-item"><span className="label">Type:</span><span className="value">Book</span></div>
          <div className="content-header-item"><span className="label">Weight:</span><span className="value">???</span></div>
          <div className="content-header-item"><span className="label">Cost:</span><span className="value">???</span></div>
          <div className="content-header-item"><span className="label">Quantity:</span><span className="value">1</span></div>
        </div>
        <div className="items-grid">
          <div className="items-masonry">
            <div className="item-card">
              <h2>Magical Atributes</h2>
              <dl className="atribute-list"><dt>School:</dt><dd>Abduration</dd><dt>Attunment:</dt><dd>None</dd></dl>
            </div>
            <div className="item-card">
              <h2>Effect</h2>
              <p>Placeholder effect.</p>
            </div>
            <div className="item-card">
              <h2>Picture</h2>
              <img src="https://img.freepik.com/free-vector/book-magic-spells-witchcraft_105738-781.jpg?semt=ais_hybrid&w=740&q=80" alt="Character Picture" />
            </div>
          </div>
          <div className="item-card wide">
            <h2>Generell Notes</h2>
            <p>Placeholder notes.</p>
          </div>
        </div>
      </main>
    </>
  )
}
