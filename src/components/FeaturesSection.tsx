import { 
  MessageCircle, 
  Headphones, 
  Trophy, 
  Users, 
  BookOpen, 
  Globe,
  Mic,
  Brain
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: "Interactive Conversations",
    description: "Practice real-world conversations with AI tutors and native speakers",
    color: "text-amber-600"
  },
  {
    icon: Headphones,
    title: "Audio Pronunciation",
    description: "Perfect your pronunciation with native speaker audio and voice recognition",
    color: "text-orange-600"
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn points, unlock achievements, and compete with friends",
    color: "text-yellow-600"
  },
  {
    icon: Users,
    title: "Cultural Immersion",
    description: "Learn about traditions, customs, and cultural context alongside language",
    color: "text-amber-700"
  },
  {
    icon: BookOpen,
    title: "Comprehensive Lessons",
    description: "Structured curriculum from basics to advanced conversation skills",
    color: "text-orange-700"
  },
  {
    icon: Globe,
    title: "Multiple Dialects",
    description: "Learn regional variations and dialects of each language",
    color: "text-amber-800"
  },
  {
    icon: Mic,
    title: "Speech Recognition",
    description: "Advanced AI analyzes your pronunciation and provides instant feedback",
    color: "text-orange-800"
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "Personalized learning paths that adapt to your progress and style",
    color: "text-amber-900"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Why Choose Afrilingo?
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Experience the most comprehensive and engaging way to learn African languages with cutting-edge technology and cultural authenticity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-amber-200"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-amber-300">
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              
              <h3 className="text-lg font-bold text-amber-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-amber-700 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-amber-800 to-orange-800 rounded-2xl p-8 md:p-12 shadow-2xl text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Start Your African Language Journey Today
              </h3>
              <p className="text-amber-100 mb-6">
                Join thousands of learners who are already connecting with African cultures through language. Get started with our free Kinyarwanda course and unlock the beauty of African communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-amber-800 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Free Trial
                </button>
                <button className="border border-amber-300 text-white hover:bg-amber-700 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 border border-amber-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">15+</div>
                    <div className="text-amber-200">African Languages</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-amber-200">Active Learners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-amber-200">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
