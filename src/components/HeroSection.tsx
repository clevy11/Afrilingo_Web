
import { Users, BookOpen, Facebook, Twitter, Instagram, Youtube, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com/Afrilingo',
      twitter: 'https://twitter.com/Afrilingo',
      instagram: 'https://instagram.com/Afrilingo',
      youtube: 'https://youtube.com/Afrilingo'
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleStartLearning = () => {
    // Trigger APK download from public/apk/app-release.apk
    window.location.href = '/apk/app-release.apk';
  };

  return (
    <section className="bg-gradient-to-br from-background/80 via-background/80 to-background/80 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 dark:text-gray-100 leading-tight">
                Learn <span className="text-amber-900 dark:text-gray-100">African</span> Languages with <span className="text-amber-900 dark:text-gray-100">Afrilingo</span>
              </h1>
              <p className="text-xl text-amber-800 dark:text-gray-300 leading-relaxed">
                Discover the rich diversity of African languages through interactive lessons, cultural insights, and native speaker guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleStartLearning}
                className="bg-amber-800 dark:bg-amber-700 hover:bg-amber-900 dark:hover:bg-amber-600 text-amber-50 dark:text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
              >
                Start Learning Free
              </Button>

              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                <span className="text-amber-700 dark:text-gray-400 font-medium">Follow us:</span>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleSocialClick('facebook')}
                    className="border-amber-600 dark:border-amber-400/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleSocialClick('twitter')}
                    className="border-amber-600 dark:border-amber-400/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all duration-300 hover:scale-110"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleSocialClick('instagram')}
                    className="border-amber-600 dark:border-amber-400/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleSocialClick('youtube')}
                    className="border-amber-600 dark:border-amber-400/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all duration-300 hover:scale-110"
                  >
                    <Youtube className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm text-amber-700 dark:text-gray-400">50K+ learners</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-amber-700 dark:text-gray-400 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Card className="p-6 bg-card shadow-2xl border-0 dark:border dark:border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-md dark:shadow-none dark:bg-white/5">
                      <img
                        src="/lovable-uploads/11afa540-f243-4c5a-93e4-f75f0daebf89.png"
                        alt="Afrilingo Logo"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 dark:text-gray-100">Kinyarwanda Basics</h3>
                      <p className="text-sm text-amber-700 dark:text-gray-400">Lesson 1: Greetings</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-800 dark:text-gray-300">Progress</span>
                      <span className="text-amber-700 dark:text-gray-400 font-medium">75%</span>
                    </div>
                    <div className="w-full bg-amber-200 dark:bg-amber-900/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-100 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>Learning with 1,234 others</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-3xl transform -rotate-2 scale-110 opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
