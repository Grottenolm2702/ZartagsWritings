import React from "react";
import Layout from "../components/Layout";
import aboutStyles from "../styles/about.module.css";

export default function About() {
  return (
    <Layout>
      <main>
        <h1>About Zartags Writings</h1>

        <section className={aboutStyles.aboutSection}>
          <h2>Who We Are</h2>
          <p>
            Welcome to Zartags Writings – a note-taking tool dedicated to D&D
            and other pen-and-paper games.
          </p>
        </section>

        <section className={aboutStyles.aboutSection}>
          <h2>Our Mission</h2>
          <p>
            The goal is to build a tool that helps both DMs and players easily
            create, organize, and navigate notes for their current game.
          </p>
        </section>

        <section className={aboutStyles.aboutSection}>
          <h2>What We Offer</h2>
          <ul>
            <li>
              <strong>Separate Campaigns:</strong> Each campaign has its own
              members, join code, and entries.
            </li>
            <li>
              <strong>Character Profiles:</strong> Ready-to-edit pages for
              player characters (PCs) and non-player characters (NPCs).
            </li>
            <li>
              <strong>Locations:</strong> Structured location entries with cards
              for notes and details.
            </li>
            <li>
              <strong>Magic Items:</strong> Dedicated templates for item-based
              campaign content.
            </li>
          </ul>
        </section>

        <section className={aboutStyles.aboutSection}>
          <h2>The Authors</h2>
          <p>
            Zartags Writings is being developed by Melissa Armbruster and Ronny
            Wittmer as part of a web development course.
          </p>
        </section>

        <section className={aboutStyles.aboutSection}>
          <h2>Get Involved</h2>
          <p>Have feedback? Feel free to reach out.</p>
        </section>
      </main>
    </Layout>
  );
}
