const CALENDLY_URL = 'https://calendly.com/andreaskaravanas/30-minute-demo';

export default function CTASection() {
  return (
    <section className="bg-text-main rounded-2xl p-10 md:p-12 text-center relative overflow-hidden shadow-elevated">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
          Θέλετε να δούμε αυτές τις<br />ευκαιρίες στην πράξη;
        </h3>
        <p className="text-white/70 mb-10 max-w-lg mx-auto leading-relaxed">
          Κλείστε ένα δωρεάν 30-λεπτο call για να συζητήσουμε πώς μπορούμε να υλοποιήσουμε αυτές τις λύσεις AI.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-text-main transition-all shadow-medium hover:shadow-elevated hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Κλείστε δωρεάν 30-λεπτο call
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>

        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-sm text-white/50">
            Powered by{' '}
            <a
              href="https://liberators.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/70 hover:text-white transition-colors"
            >
              Liberators AI
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
