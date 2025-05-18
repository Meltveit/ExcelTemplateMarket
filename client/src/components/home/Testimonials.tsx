import { Star, StarHalf } from 'lucide-react';

interface TestimonialProps {
  text: string;
  author: string;
  role: string;
  initials: string;
  stars: number;
}

const Testimonial = ({ text, author, role, initials, stars }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center text-yellow-500 mb-4">
        {Array.from({ length: Math.floor(stars) }).map((_, i) => (
          <Star key={i} className="fill-current h-4 w-4" />
        ))}
        {stars % 1 !== 0 && <StarHalf className="fill-current h-4 w-4" />}
      </div>
      <p className="italic mb-6">{text}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
          <span className="font-semibold text-dark">{initials}</span>
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Trusted by professionals around the world to streamline their Excel workflows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial 
            text="The financial dashboard template saved me hours of work. Everything is well organized and the formulas work perfectly. Highly recommended!"
            author="John Davis"
            role="Financial Analyst"
            initials="JD"
            stars={5}
          />
          
          <Testimonial 
            text="As a project manager, the project management suite has become an essential tool in my workflow. It's intuitive and has all the features I need."
            author="Sarah Miller"
            role="Project Manager"
            initials="SM"
            stars={5}
          />
          
          <Testimonial 
            text="The inventory management system is perfect for our small business. It's easy to use and has helped us optimize our stock levels and reduce costs."
            author="Robert Lee"
            role="Small Business Owner"
            initials="RL"
            stars={4.5}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
