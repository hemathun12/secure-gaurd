import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Zap, Lock } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-brand-blue dark:text-blue-400 text-sm font-medium mb-8 animate-fade-in shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                        </span>
                        v2.0 is now live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6 tracking-tight leading-tight animate-slide-up">
                        Secure File Sharing <br />
                        <span className="text-brand-blue inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text pb-2">Reimagined.</span>
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Experience the next generation of secure cloud storage.
                        AI-driven threat detection, military-grade encryption, and seamless sharing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/register" className="px-8 py-4 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center gap-2 group transform hover:-translate-y-0.5">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="px-8 py-4 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] font-semibold text-lg hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-all duration-300 shadow-sm">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-brand-blue" />}
                            title="End-to-End Encryption"
                            description="Your files are encrypted before they even leave your device. Only you hold the keys."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-orange-500" />}
                            title="Lightning Fast"
                            description="Optimized upload speeds with global CDN distribution ensures your files are available instantly."
                        />
                        <FeatureCard
                            icon={<Globe className="w-8 h-8 text-emerald-500" />}
                            title="Global Access"
                            description="Access your secure vault from anywhere in the world, on any device."
                        />
                        <FeatureCard
                            icon={<Lock className="w-8 h-8 text-purple-500" />}
                            title="AI Threat Detection"
                            description="Real-time AI scanning prevents malicious file uploads, keeping your storage safe."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-brand-blue/30 hover:shadow-lg transition-all duration-300 group">
        <div className="mb-6 p-4 rounded-xl bg-[var(--bg-primary)] w-fit group-hover:scale-110 transition-transform duration-300 shadow-sm border border-[var(--border-color)]">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;
