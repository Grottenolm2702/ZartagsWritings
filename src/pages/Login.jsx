import React from 'react'
import Header from '../components/Header'

export default function Login() {
  return (
    <>
      <Header />
      <main>
        <h1>Login</h1>
        <form>
          <label htmlFor="email"> E-mail-Adresse:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="youre@email.com"
            autoComplete="email"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            minLength={8}
            maxLength={30}
          />
          <button type="submit">Login</button>
        </form>
      </main>
    </>
  )
}
