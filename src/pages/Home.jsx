import React from "react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <main>
        <h1>Zartags Writings</h1>
        <section className="items-grid">
          <div className="items-masonry">
            <article className="campaign-card">
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
            <article className="campaign-card">
              <a href="#">
                <h2>My Second Blog Post</h2>
                <p>
                  This is the content of my first blog post. It contains some
                  interesting information about my thoughts and experiences.
                </p>
              </a>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
