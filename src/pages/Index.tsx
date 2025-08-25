
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MobileAppSection from '@/components/MobileAppSection';
import CourseSection from '@/components/CourseSection';
import AboutSection from '@/components/AboutSection';
import ExploreFeaturesSection from '@/components/ExploreFeaturesSection';
import FeaturesSection from '@/components/FeaturesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        <HeroSection />
        <MobileAppSection />
        <CourseSection />
        <AboutSection />
        <ExploreFeaturesSection />
        <FeaturesSection />
        <ContactSection />
        <Footer />
      </div>
      <ChatBot />
      <ThemeToggle />
    </div>
  );
};

export default Index;
