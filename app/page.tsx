'use client'

import Navbar from './src/components/Navbar/Navbar'
import Hero from './src/components/Hero/Hero'
import WhoAmI from './src/components/WhoAmI/WhoAmI'
import Projects from './src/components/Projects/Projects'
import Contact from './src/components/Contact/Contact'
import Footer from './src/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhoAmI />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}