const CALENDLY_URL = 'https://calendly.com/andreaskaravanas/30-minute-demo';

export default function CTASection() {
  return (
    <section className="bg-gray-50 rounded-lg p-8 text-center">
      <h3 className="text-2xl font-bold text-text-main mb-3">
        Θέλετε να εμβαθύνουμε;
      </h3>
      <p className="text-text-muted mb-6 max-w-lg mx-auto">
        Κλείστε ένα δωρεάν 30-λεπτο call με τους ειδικούς μας για να συζητήσουμε
        πώς μπορείτε να αξιοποιήσετε το AI στην εταιρεία σας.
      </p>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      >
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

      <div className="mt-8 pt-6 border-t border-border-light">
        <p className="text-sm text-text-muted">
          Powered by{' '}
          <a
            href="https://liberators.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Liberators AI
          </a>
        </p>
      </div>
    </section>
  );
}
