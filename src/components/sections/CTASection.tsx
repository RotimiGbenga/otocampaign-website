import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-campaign-green-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Your support matters. Whether you volunteer, spread the word, or
          contribute your ideas—every action counts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/get-involved" className="btn-primary">
            Volunteer Now
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
