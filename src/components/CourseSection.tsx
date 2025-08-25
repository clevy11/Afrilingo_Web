
import { Clock, Users, Star, ArrowRight, BookOpen, MessageCircle, Volume2, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mainCourse = {
  id: 1,
  title: "Kinyarwanda for Beginners",
  description: "Learn the official language of Rwanda with interactive lessons and cultural context. Master greetings, basic conversations, and cultural insights.",
  level: "Beginner",
  duration: "12 weeks",
  students: "15,432",
  rating: 4.9,
  price: "Free",
  flag: "🇷🇼",
  country: "Rwanda"
};

const courseFeatures = [
  { icon: BookOpen, name: "Vocabulary", color: "text-amber-700" },
  { icon: MessageCircle, name: "Grammar", color: "text-orange-700" },
  { icon: Volume2, name: "Greetings", color: "text-yellow-700" },
  { icon: ArrowRight, name: "Translation", color: "text-red-700" },
  { icon: Gamepad2, name: "Games", color: "text-purple-700" }
];

const comingSoonLanguages = [
  { name: "Swahili", flag: "🇹🇿", countries: "Tanzania, Kenya, Uganda" },
  { name: "Yoruba", flag: "🇳🇬", countries: "Nigeria, Benin, Togo" },
  { name: "Amharic", flag: "🇪🇹", countries: "Ethiopia" },
  { name: "Zulu", flag: "🇿🇦", countries: "South Africa" },
  { name: "Hausa", flag: "🇳🇬", countries: "Nigeria, Niger, Chad" },
  { name: "Igbo", flag: "🇳🇬", countries: "Nigeria" },
  { name: "Xhosa", flag: "🇿🇦", countries: "South Africa" },
  { name: "Wolof", flag: "🇸🇳", countries: "Senegal, Gambia" }
];

const CourseSection = () => {
  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Explore African Languages
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Start your journey with Kinyarwanda, with more African languages coming soon to immerse you in the culture and communication.
          </p>
        </div>

        {/* Main Kinyarwanda Course */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-amber-900 mb-8 text-center">Available Now</h3>
          <div className="flex justify-center">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-amber-200 shadow-lg max-w-md">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-red-100 via-yellow-100 to-green-100 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop&crop=center"
                    alt="Rwanda Flag"
                    className="w-32 h-20 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white">
                      {mainCourse.price}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs border-amber-600 text-amber-700">
                    {mainCourse.level}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-amber-900 mb-2">{mainCourse.title}</h3>
                <p className="text-amber-700 text-sm mb-4">{mainCourse.description}</p>
                
                <div className="text-xs text-amber-600 mb-4">
                  Spoken in: {mainCourse.country}
                </div>

                {/* Course Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">What you'll learn:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {courseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <feature.icon className={`h-3 w-3 ${feature.color}`} />
                        <span className="text-xs text-amber-700">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-amber-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{mainCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{mainCourse.students}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{mainCourse.rating}</span>
                  <span className="text-sm text-amber-600">rating</span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white group">
                  Start Learning
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Coming Soon Languages */}
        <div>
          <h3 className="text-2xl font-bold text-amber-900 mb-8 text-center">Coming Soon</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {comingSoonLanguages.map((language, index) => (
              <Card key={index} className="p-4 text-center border-2 border-dashed border-amber-300 bg-amber-50">
                <div className="text-3xl mb-2">{language.flag}</div>
                <h4 className="font-semibold text-amber-800 mb-1">{language.name}</h4>
                <p className="text-xs text-amber-600">{language.countries}</p>
                <Badge variant="secondary" className="mt-2 text-xs bg-amber-200 text-amber-800">
                  Coming Soon
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-amber-700 mb-4">
            Be the first to know when new languages are available!
          </p>
          <Button variant="outline" size="lg" className="border-amber-600 text-amber-700 hover:bg-amber-50">
            Join Waitlist
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
