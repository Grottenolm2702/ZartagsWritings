import React from 'react'
import Header from '../components/Header'

export default function About() {
  return (
    <>
      <Header />
      <main>
        <h1>About Zartags Writings</h1>
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Welcome to Zartags Writings – a note-taking tool dedicated to D&D and
            other pen-and-paper games.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            The goal is to build a tool that helps both DMs and players easily
            create, organize, and navigate notes for their current game.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <ul>
            <li>
              <strong>Seperate Campaign:</strong> Each campaign operates within
              its own separate environment.
            </li>
            <li>
              <strong>Character Profiles:</strong> Flexible, highly customizable
              templates for both player characters (PCs) and non-player characters
              (NPCs).
            </li>
            <li>
              <strong>Lore & Locations:</strong> Comprehensive templates for all
              types of locations, along with lore elements such as deities,
              historical events, religions, and related worldbuilding aspects.
            </li>
            <li>
              <strong>Items & Artifacts:</strong> Customizable templates for both
              magical and non-magical items.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>The Authors</h2>
          <p>
            Zartags Writings is beeing developed by Melissa Armbruster and Ronny
            Wittmer as part of a web development course.
          </p>
        </section>
      </main>
    </>
  )
}
