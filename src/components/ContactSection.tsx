
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    learnerType: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message! We will get back to you within 24 hours.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '', learnerType: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCardClick = (type: 'email' | 'phone') => {
    if (type === 'email') {
      window.location.href = 'mailto:afrilingoedtech@gmail.com';
      toast({
        title: "Opening Email Client",
        description: "Redirecting to your default email application...",
      });
    } else if (type === 'phone') {
      window.location.href = 'tel:+250788123456';
      toast({
        title: "Initiating Call",
        description: "Opening phone application...",
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-amber-100 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">Contact Us</h2>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto">
            Have questions about learning Kinyarwanda? Need support with our platform? 
            We're here to help you on your language learning journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card 
              className="border-amber-200 bg-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('email')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-amber-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Email Us</h3>
                    <p className="text-amber-700 hover:text-amber-900 transition-colors">afrilingoedtech@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-amber-200 bg-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('phone')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-amber-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Call Us</h3>
                    <p className="text-amber-700 hover:text-amber-900 transition-colors">+250 788 123 456</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-amber-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Visit Us</h3>
                    <p className="text-amber-700">Kigali, Rwanda</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Support Hours</h3>
                    <p className="text-amber-700">Mon-Fri: 8AM-6PM EAT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-amber-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-900">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-amber-900">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="border-amber-300 focus:border-amber-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-amber-900">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="border-amber-300 focus:border-amber-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="learnerType" className="text-amber-900">I am a...</Label>
                    <select
                      id="learnerType"
                      name="learnerType"
                      required
                      value={formData.learnerType}
                      onChange={handleChange}
                      className="w-full h-10 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select your situation</option>
                      <option value="foreigner-rwanda">Foreigner living in Rwanda</option>
                      <option value="planning-visit">Planning to visit/move to Rwanda</option>
                      <option value="heritage-learner">Heritage learner (Rwandan diaspora)</option>
                      <option value="language-enthusiast">Language enthusiast</option>
                      <option value="student">Student</option>
                      <option value="business-professional">Business professional</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-amber-900">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="border-amber-300 focus:border-amber-500"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-amber-900">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="border-amber-300 focus:border-amber-500"
                      placeholder="Tell us about your language learning goals, questions, or how we can help you..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50 py-3 text-lg transition-all duration-300 hover:scale-105"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
