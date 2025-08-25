
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Amara Johnson",
    role: "Cultural Researcher",
    content: "Afrilingo helped me connect with my Yoruba heritage in ways I never imagined. The cultural context provided with each lesson made learning so much more meaningful.",
    rating: 5,
    avatar: "AJ",
    country: "🇺🇸 USA"
  },
  {
    name: "David Ochieng",
    role: "Business Professional",
    content: "Learning Swahili through Afrilingo opened up incredible business opportunities across East Africa. The pronunciation feature is absolutely outstanding.",
    rating: 5,
    avatar: "DO",
    country: "🇰🇪 Kenya"
  },
  {
    name: "Sarah Mohamed",
    role: "Language Enthusiast",
    content: "I've tried many language apps, but Afrilingo's approach to African languages is unmatched. The native speaker interactions made all the difference.",
    rating: 5,
    avatar: "SM",
    country: "🇪🇬 Egypt"
  },
  {
    name: "Marcus Williams",
    role: "Travel Blogger",
    content: "Afrilingo prepared me perfectly for my travels across Africa. I could actually communicate with locals and understand cultural nuances.",
    rating: 5,
    avatar: "MW",
    country: "🇬🇧 UK"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Learners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied learners who have transformed their connection to African cultures through language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="h-8 w-8 text-orange-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic relative z-10 pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.country}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of learners and discover the beauty of African languages. Start with any of our free courses today.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Begin Learning Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
