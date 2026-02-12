
import { Users, Globe, BookOpen, Heart, Award, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 dark:text-foreground mb-6">About Gabalang</h2>
          <p className="text-xl text-amber-700 dark:text-muted max-w-3xl mx-auto leading-relaxed">
            Gabalang is dedicated to making African languages accessible to everyone. We specialize in helping foreigners living in Rwanda and anyone who needs to learn Kinyarwanda integrate seamlessly into Rwandan culture and society.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 dark:text-foreground">For Foreigners in Rwanda</h3>
              </div>
              <p className="text-amber-700 dark:text-muted">
                Whether you're an expert, international student, or business professional, we help you navigate daily life in Rwanda with confidence through practical Kinyarwanda lessons.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 dark:text-foreground">Cultural Integration</h3>
              </div>
              <p className="text-amber-700 dark:text-muted">
                Learn not just the language, but the rich cultural context that makes communication meaningful and respectful in Rwandan society.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 dark:text-foreground">Interactive Learning</h3>
              </div>
              <p className="text-amber-700 dark:text-muted">
                Our platform offers engaging vocabulary lessons, grammar guides, pronunciation practice, and real-world conversation scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 dark:text-foreground">AI Assistant</h3>
              </div>
              <p className="text-amber-700 dark:text-muted">
                Get instant help with translations, pronunciation, and cultural questions from our intelligent Kinyarwanda assistant available 24/7.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 dark:text-foreground">Practical Skills</h3>
              </div>
              <p className="text-amber-700 dark:text-muted">
                Focus on essential phrases for shopping, work, healthcare, and social interactions that you'll use in your daily life in Rwanda.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 dark:text-foreground">Community Support</h3>
              </div>
              <p className="text-amber-700 dark:text-muted">
                Join a supportive community of learners and native speakers who share tips, practice together, and celebrate learning milestones.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-amber-900 dark:text-foreground mb-4">Our Mission</h3>
          <p className="text-lg text-amber-700 dark:text-muted max-w-4xl mx-auto">
            At Gabalang, we believe that language is the bridge to understanding, connection, and belonging.
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
