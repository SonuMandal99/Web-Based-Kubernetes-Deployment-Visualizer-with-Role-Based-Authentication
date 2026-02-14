import { Link } from 'react-router';
import { 
  ArrowRight, 
  Check, 
  Star,
  Activity,
  Shield,
  Zap,
  Globe,
  Users,
  BarChart3
} from 'lucide-react';

export function Landing() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Read-only access',
        'Basic monitoring',
        'No scaling',
        'Community support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For professional teams',
      features: [
        'Deployment scaling',
        'Graph visualization',
        'Full monitoring',
        'Activity logs',
        'Email support',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Multi-cluster support',
        'Team access',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'DevOps Engineer',
      company: 'TechCorp',
      content: 'K8s Visualizer has transformed how we manage our deployments. The graph view makes troubleshooting so much easier.',
      rating: 5,
      avatar: 'SC',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Platform Lead',
      company: 'CloudScale',
      content: 'Best Kubernetes monitoring tool we\'ve used. The role-based access control is exactly what we needed.',
      rating: 5,
      avatar: 'MR',
    },
    {
      name: 'Emily Watson',
      role: 'SRE Manager',
      company: 'DataFlow',
      content: 'Clean interface, powerful features. Our entire team adopted it within days. Highly recommended!',
      rating: 5,
      avatar: 'EW',
    },
  ];

  const features = [
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track your deployments, pods, and services in real-time',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure your cluster with admin and viewer roles',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with minimal overhead',
    },
    {
      icon: Globe,
      title: 'Multi-Cluster',
      description: 'Manage multiple Kubernetes clusters from one place',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team seamlessly',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get insights into your cluster performance',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">K8s Visualizer</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 animate-fadeIn">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Kubernetes Deployment
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Visualization Made Simple
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Monitor, manage, and visualize your Kubernetes deployments with a modern, 
            intuitive dashboard. Built for DevOps teams who value efficiency.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 border border-slate-700 hover:border-slate-600 transform hover:-translate-y-1"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Everything you need to manage K8s
            </h2>
            <p className="text-xl text-slate-400">
              Powerful features for modern DevOps teams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Choose the plan that fits your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`group bg-slate-800/50 border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 animate-fadeIn ${
                  plan.highlighted
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/30 scale-105 hover:shadow-blue-500/50'
                    : 'border-slate-700 hover:border-slate-600 hover:shadow-xl'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-6 shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-400 text-lg">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
                      : 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:border-slate-600 transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                      Feature
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-semibold text-slate-300">
                      Starter
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-semibold text-slate-300">
                      Pro
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-semibold text-slate-300">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {[
                    { feature: 'Deployments monitoring', starter: true, pro: true, enterprise: true },
                    { feature: 'Graph visualization', starter: false, pro: true, enterprise: true },
                    { feature: 'Deployment scaling', starter: false, pro: true, enterprise: true },
                    { feature: 'Multi-cluster support', starter: false, pro: false, enterprise: true },
                    { feature: 'Team collaboration', starter: false, pro: false, enterprise: true },
                    { feature: 'Advanced analytics', starter: false, pro: false, enterprise: true },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-slate-300 font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {row.starter ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.pro ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.enterprise ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Testimonials Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Trusted by DevOps Teams Worldwide
            </h2>
            <p className="text-xl text-slate-400">
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center font-semibold text-white shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 lg:p-16 text-center shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Start Monitoring Your Kubernetes Cluster Today
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of teams already using K8s Visualizer to manage their deployments
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="bg-white hover:bg-slate-100 active:bg-slate-200 text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 border-2 border-blue-500 hover:border-blue-400 transform hover:-translate-y-1"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p className="text-lg">&copy; 2026 K8s Visualizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}