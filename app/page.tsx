'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import Loader from '@/components/ui/Loader';
import NeonLine from '@/components/ui/NeonLine';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';
import NowSection from '@/components/sections/Now';

// Heavy canvas / 3D components — loaded client-side only
const ParticleCanvas = dynamic(() => import('@/components/ui/ParticleCanvas'), { ssr: false });
const VibesBoard = dynamic(() => import('@/components/sections/VibesBoard'), { ssr: false });
const SpotifyPopup = dynamic(() => import('@/components/ui/SpotifyPopup'), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />

      {loaded && (
        <>
          {/* Fixed backgrounds */}
          <ParticleCanvas />
          <div className="grid-overlay" aria-hidden="true" />
          <SpotifyPopup />

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main>
            <Hero />
            <NeonLine />
            <About />
            <NeonLine />
            <Projects />
            <NeonLine />
            <NowSection />
            <NeonLine />
            <VibesBoard />
            <NeonLine />
            <Certifications />
            <NeonLine />
            <Contact />
          </main>
        </>
      )}
    </>
  );
}
