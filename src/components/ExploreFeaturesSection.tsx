
import { useState } from 'react';
import { BookOpen, MessageCircle, Languages, Brain, Play, Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const languages = [
  { id: 'kinyarwanda', name: 'Kinyarwanda', flag: '🇷🇼' },
  { id: 'swahili', name: 'Swahili', flag: '🇹🇿' },
  { id: 'zulu', name: 'Zulu', flag: '🇿🇦' },
  { id: 'yoruba', name: 'Yoruba', flag: '🇳🇬' }
];

const features = [
  {
    id: 'courses',
    title: 'Interactive Courses',
    icon: BookOpen,
    description: 'Comprehensive lessons designed by native speakers',
    color: 'bg-amber-100 text-amber-800',
    content: {
      subtitle: 'Master African Languages Step by Step',
      details: 'Our structured courses take you from beginner to conversational fluency with bite-sized lessons, cultural insights, and real-world scenarios.',
      stats: { lessons: '200+', languages: '15+', completion: '95%' }
    }
  },
  {
    id: 'quizzes',
    title: 'Smart Quizzes',
    icon: Brain,
    description: 'Adaptive quizzes that adjust to your learning pace',
    color: 'bg-orange-100 text-orange-800',
    content: {
      subtitle: 'Test Your Knowledge Intelligently',
      details: 'Our AI-powered quizzes adapt to your progress, focusing on areas where you need improvement while reinforcing your strengths.',
      stats: { questions: '5000+', accuracy: '92%', adaptive: 'AI-Powered' }
    }
  },
  {
    id: 'chatbot',
    title: 'AI Chatbot',
    icon: MessageCircle,
    description: 'Practice conversations with AI native speakers',
    color: 'bg-yellow-100 text-yellow-800',
    content: {
      subtitle: 'Converse with AI Native Speakers',
      details: 'Practice real conversations with our advanced AI chatbot trained on authentic African language patterns and cultural contexts.',
      stats: { conversations: '10K+', languages: '12', availability: '24/7' }
    }
  },
  {
    id: 'translate',
    title: 'Live Translator',
    icon: Languages,
    description: 'Real-time translation between African languages',
    color: 'bg-red-100 text-red-800',
    content: {
      subtitle: 'Break Language Barriers Instantly',
      details: 'Our advanced translator supports multiple African languages with cultural context, helping you understand not just words but meanings.',
      stats: { languages: '15+', accuracy: '96%', speed: 'Instant' }
    }
  }
];

const ExploreFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState('courses');
  const [selectedLanguage, setSelectedLanguage] = useState('kinyarwanda');

  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="py-20 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6">
            Explore Our Features
          </h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Discover the comprehensive tools that make Afrilingo the most effective way to learn African languages
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Feature Cards */}
          <div className="lg:col-span-1 space-y-3">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  activeFeature === feature.id 
                    ? 'border-amber-300 bg-amber-50 shadow-lg scale-105' 
                    : 'border-amber-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 text-sm">{feature.title}</h3>
                      <p className="text-xs text-amber-700">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${currentFeature.color} flex items-center justify-center mb-4`}>
                  <currentFeature.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-amber-900">{currentFeature.content.subtitle}</CardTitle>
                
                {/* Language Selection Bar */}
                {activeFeature === 'courses' && (
                  <div className="flex justify-center gap-2 mt-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          selectedLanguage === lang.id
                            ? 'bg-amber-800 text-white'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <span className="mr-1">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-amber-800 leading-relaxed text-center">
                  {currentFeature.content.details}
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(currentFeature.content.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-lg font-bold text-amber-900">{value}</div>
                      <div className="text-xs text-amber-700 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button size="lg" className="bg-amber-800 hover:bg-amber-900 text-amber-50">
                    <Play className="h-4 w-4 mr-2" />
                    Try {currentFeature.title}
                  </Button>
                  <Button size="lg" variant="outline" className="border-amber-800 text-amber-800 hover:bg-amber-100">
                    Learn More
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Trusted by 50K+ learners
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreFeaturesSection;
