import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import PageTypes from "../components/home/PageTypes";
import PricingTiers from "../components/home/PricingTiers";
import FeaturedTemplates from "../components/home/FeaturedTemplates";
import DemoSection from "../components/home/DemoSection";
import PublicGallery from "../components/home/PublicGallery";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <PageTypes />
      <section id="pricing">
        <PricingTiers />
      </section>
      <FeaturedTemplates />
      <DemoSection />
      <PublicGallery />
      <Footer />
    </main>
  );
}
