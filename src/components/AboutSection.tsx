
import { Users, Globe, BookOpen, Heart, Award, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">About Afrilingo</h2>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed">
            Afrilingo is dedicated to making African languages accessible to everyone. We specialize in helping foreigners living in Rwanda and anyone who needs to learn Kinyarwanda integrate seamlessly into Rwandan culture and society.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-amber-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-amber-50" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900">For Foreigners in Rwanda</h3>
              </div>
              <p className="text-amber-700">
                Whether you're an expat, international student, or business professional, we help you navigate daily life in Rwanda with confidence through practical Kinyarwanda lessons.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-amber-50" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Cultural Integration</h3>
              </div>
              <p className="text-amber-700">
                Learn not just the language, but the rich cultural context that makes communication meaningful and respectful in Rwandan society.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-amber-50" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Interactive Learning</h3>
              </div>
              <p className="text-amber-700">
                Our platform offers engaging vocabulary lessons, grammar guides, pronunciation practice, and real-world conversation scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-amber-50" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900">AI Assistant</h3>
              </div>
              <p className="text-amber-700">
                Get instant help with translations, pronunciation, and cultural questions from our intelligent Kinyarwanda assistant available 24/7.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-amber-50" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Practical Skills</h3>
              </div>
              <p className="text-amber-700">
                Focus on essential phrases for shopping, work, healthcare, and social interactions that you'll use in your daily life in Rwanda.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-amber-50" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Community Support</h3>
              </div>
              <p className="text-amber-700">
                Join a supportive community of learners and native speakers who share tips, practice together, and celebrate learning milestones.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">Our Mission</h3>
          <p className="text-lg text-amber-800 max-w-4xl mx-auto">
            At Afrilingo, we believe that language is the bridge to understanding, connection, and belonging. 
            Our mission is to empower foreigners in Rwanda and Kinyarwanda learners worldwide with the linguistic 
            tools they need to thrive in their personal and professional lives while honoring the beauty and 
            richness of African languages and cultures.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
