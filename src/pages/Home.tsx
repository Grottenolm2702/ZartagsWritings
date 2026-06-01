import React from "react";
import Layout from "../components/Layout";
import contentStyles from "../styles/content.module.css";

export default function Home() {
  return (
    <Layout>
      <main>
        <h1>Zartags Writings</h1>
        <section className={contentStyles.itemsGrid}>
          <div className={contentStyles.itemsMasonry}>
            <article className={contentStyles.campaignCard}>
              <a href="/capaign1/overview">
                <h2>Vergessene Geschichten Kavantas</h2>
                <p>
                  In einer Welt deren Boden von Magie durchzogen ist bekommen
                  sechs Wesen die Möglichkeit, durch dass unterschreiben eines
                  Vertrags, die wichtigste Sache in ihrem Leben zu erhalten. Nun
                  müssen sie ihren Vertrag jedoch auch erfüllen und treffen
                  dadurch auf Mysterien und Gefahren die schon lange im Schatten
                  Kavantas lauern.
                </p>
              </a>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
