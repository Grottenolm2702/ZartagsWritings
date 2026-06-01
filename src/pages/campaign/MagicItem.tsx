import React from 'react'
import Layout from '../../components/Layout'

export default function MagicItem() {
  return (
    <Layout>
      <main>
        <h1>Magic Item</h1>
        <div className="content-header">
          <div className="content-header-item"><span className="label">Name:</span><span className="value">Die Unendliche Geschichte</span></div>
        </div>
      </main>
    </Layout>
  )
}
