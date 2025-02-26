import PublicHeader from '@/components/shared/public-header'
import React from 'react'
import Banner from '../components/banner'
import Footer from '../components/footer'
import About from '../components/about'

// template copied from here
// https://tailwindflex.com/@conan-hilton/landing-page-template
// Thanks to @conan-hilton

function Home() {
  return (
    <main className="bg-gradient-to-br from-gray-900 to-black">
      <div className="text-gray-300 container mx-auto p-8 overflow-hidden md:rounded-lg md:p-10 lg:p-12">
        <PublicHeader />

        <div className="h-32 md:h-40"></div>

        <Banner />

        <div className="h-32 md:h-40"></div>

        <About />




        <div className="h-10 md:h-40"></div>

        <Footer />
      </div>
    </main>
  )
}

export default Home