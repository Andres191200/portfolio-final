'use client'

import Navbar from './src/components/Navbar/Navbar'
import ScrollContainer from './src/components/ScrollContainer/ScrollContainer'
import Footer from './src/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollContainer />
      </main>
      <Footer />
    </>
  )
}