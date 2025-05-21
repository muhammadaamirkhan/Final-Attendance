import React from 'react';
import HeroBanner from '../Views/home/HeroBanner';
import FeatureSection from '../Views/home/FeatureSection';
import TestimonialSection from '../Views/home/TestimonialSection';
import CallToAction from '../Views/home/CallToAction';
import CardLayout from '../Layouts/CardLayout';
import SectionContainer from '../Layouts/SectionContainer';

function Home() {
  return (
    <>
      <SectionContainer>
        <HeroBanner />
      </SectionContainer>

      <SectionContainer>
        <FeatureSection />
      </SectionContainer>

      <CardLayout>
        <TestimonialSection />
      </CardLayout>

      <SectionContainer>
        <CallToAction />
      </SectionContainer>
    </>
  );
}

export default Home;
