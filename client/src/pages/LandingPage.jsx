import StatsCounter from '../components/StatsCounter';
import {
  ShieldCheck,
  Clock,
  Workflow,
  Lightbulb,
  Zap,
  BrainCircuit,
  FolderSearch,
  Database,
  BellRing,
  BarChart3,
  Cpu,
  ArrowRight,
  MonitorCheck
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {

  // Hindalco corporate values cards data
  const values = [
    {
      title: 'Integrity',
      desc: 'Honesty, transparency, and ethical standards in every support transaction and SLA commitment.',
      color: 'border-blue-600/30 bg-blue-50/20 text-blue-800',
      icon: ShieldCheck,
      image: '/integrity.webp'
    },
    {
      title: 'Commitment',
      desc: 'Dedicated IT resolution pathways, standing by operations 24/7 to minimize production downtime.',
      color: 'border-orange-500/30 bg-orange-50/20 text-corporate-orange',
      icon: Clock,
      image: '/commitment.webp'
    },
    {
      title: 'Passion',
      desc: 'Striving for excellence in technological automation, delivering the highest quality internal tools.',
      color: 'border-pink-600/30 bg-pink-50/20 text-pink-800',
      icon: Lightbulb,
      image: '/passion.webp'
    },
    {
      title: 'Seamlessness',
      desc: 'Unified systems across smelters, refineries, and corporate nodes for uninterrupted data flow.',
      color: 'border-teal-600/30 bg-teal-50/20 text-teal-800',
      icon: Workflow,
      image: '/seamlessness.webp'
    },
    {
      title: 'Speed',
      desc: 'Rapid incident triage, leveraging AI classification to resolve critical tickets within SLA metrics.',
      color: 'border-red-600/30 bg-red-50/20 text-red-800',
      icon: Zap,
      image: '/speed.webp'
    }
  ];

  // Service grid data
  const services = [
    {
      title: 'AI Ticket Management',
      desc: 'Automated ticket categorization, priority scoring, and department routing via smart parsing.',
      icon: BrainCircuit
    },
    {
      title: 'Smart Issue Tracking',
      desc: 'Track support status transparently with detailed history, assignments, and resolution notes.',
      icon: MonitorCheck
    },
    {
      title: 'Knowledge Base',
      desc: 'Searchable manuals, setups, and FAQs, empowering employees with fast self-service fixes.',
      icon: FolderSearch
    },
    {
      title: 'IT Asset Requests',
      desc: 'Seamless request pipeline for system provisioning, access rights, and hardware allocations.',
      icon: Database
    },
    {
      title: 'Real-Time Alerts',
      desc: 'Instant updates regarding assignment modifications, status resolutions, or staff replies.',
      icon: BellRing
    },
    {
      title: 'Analytics Dashboard',
      desc: 'KPI monitoring dashboards displaying SLA metrics, queue weights, and agent resolutions.',
      icon: BarChart3
    }
  ];

  return (
    <div className="bg-[#F8FAFC] corporate-grid-bg min-h-screen pt-20 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="bg-gradient-mesh text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-corporate-blueLight animate-gradient-shift">
        {/* Background Image overlay with transparency */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
          style={{ backgroundImage: "url('/backg.jpg')", opacity: 0.08, mixBlendMode: 'overlay' }}
        />
        {/* Glow patterns */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-corporate-orange/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero */}
          <div className="lg:col-span-7 space-y-6 animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 px-3.5 py-1 rounded-full text-xs font-bold text-corporate-orange w-fit animate-float">
              <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-white">Next-Gen Helpdesk Integration</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-corporate-orange">
              HindConnect
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-200">
              Intelligent IT Helpdesk & Support Portal
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-medium">
              Simplifying enterprise IT support through smart automation, AI-powered ticket management, and centralized issue tracking across all manufacturing refineries, smelters, and corporate offices.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-corporate-orange text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-corporate-orangeHover transition-all shadow-lg hover:shadow-corporate-orange/40 flex items-center space-x-2 border border-transparent transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Raise Support Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Track Active Incident
              </button>
            </div>
          </div>

          {/* Right Hero - Mockup dashboard container */}
          <div className="lg:col-span-5 relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 text-slate-200 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">HindConnect Engine</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-white">VPN Gateway Latency</h4>
                    <p className="text-[10px] text-slate-405">Corporate AD Server Node</p>
                  </div>
                  <span className="text-[10px] text-green-400 font-extrabold uppercase bg-green-500/20 px-2.5 py-1 rounded-full border border-green-500/20">Operational</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-white">IT Ticket Queue Weight</h4>
                    <span className="text-[10px] text-slate-405 font-semibold">Triage Score</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-corporate-orange h-full rounded-full transition-all duration-1000" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Categorizer accuracy</h4>
                    <p className="text-[10px] text-slate-405">Pattern classification logs</p>
                  </div>
                  <span className="text-xs text-corporate-orange font-bold">98.2%</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-405">
                <span>API Status: 200 OK</span>
                <span>Active Engineers: 14 On-Call</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16 animate-slide-up">
          <h2 className="text-xs font-bold uppercase tracking-widest text-corporate-orange">Our Core Standards</h2>
          <h3 className="text-3xl font-extrabold text-corporate-blue tracking-tight">Inspired by Corporate Values</h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Aligning HindConnect support mechanisms directly with the values governing our organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {values.map((v, index) => {
            const Icon = v.icon;
            const delayClasses = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
            const delayClass = delayClasses[index] || '';
            return (
              <div
                key={v.title}
                className={`sexy-card rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between animate-slide-up group ${delayClass}`}
              >
                {/* Image Section with Overlay */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent group-hover:from-slate-950/95 transition-all duration-300"></div>
                  <div className="absolute bottom-3.5 left-4 flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center bg-white shadow-md ${v.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-4 h-4 animate-float" />
                    </div>
                    <span className="font-bold text-white text-sm drop-shadow-md group-hover:text-corporate-orange transition-colors duration-300">{v.title}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                  <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="it-support-section" className="bg-white border-y border-slate-100 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-corporate-orange">Features Index</h2>
            <h3 className="text-3xl font-extrabold text-corporate-blue tracking-tight">IT Support Solutions</h3>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Equipped with analytical and AI frameworks to handle issues with structural precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="sexy-card rounded-2xl p-6 flex space-x-4"
                >
                  <div className="bg-corporate-blue/5 text-corporate-blue p-3 rounded-xl h-12 w-12 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-corporate-blue">{s.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Live Analytics Ticker */}
      <section className="bg-gradient-to-r from-corporate-blueSoft/50 via-white to-corporate-blueSoft/50 border-y border-slate-100 text-slate-800 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-corporate-orange/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-corporate-orange">
                <StatsCounter target={15248} />
              </p>
              <p className="text-xs font-bold text-corporate-blue">Tickets Resolved</p>
              <p className="text-[10px] text-slate-400">Historical count</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-corporate-blue">
                <StatsCounter target={8420} />
              </p>
              <p className="text-xs font-bold text-corporate-blue">Active Users</p>
              <p className="text-[10px] text-slate-400">System nodes</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-green-600">
                <StatsCounter target={98.4} decimals={1} suffix="%" />
              </p>
              <p className="text-xs font-bold text-corporate-blue">SLA Compliance</p>
              <p className="text-[10px] text-slate-400">Target score</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-corporate-blue">
                <StatsCounter target={2.4} decimals={1} suffix="h" />
              </p>
              <p className="text-xs font-bold text-corporate-blue">Avg Resolution</p>
              <p className="text-[10px] text-slate-400">S1-S4 incidents</p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-corporate-orange">
                <StatsCounter target={14} />
              </p>
              <p className="text-xs font-bold text-corporate-blue">Support Teams</p>
              <p className="text-[10px] text-slate-400">On-call standby</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
