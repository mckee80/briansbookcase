import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Contribute() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-garamond mb-4 text-primary">
            Become a Contributing Author
          </h1>
          <p className="font-crimson text-lg text-gray-700">
            Share your fiction to support mental health and suicide prevention
          </p>
        </div>

        {/* We Appreciate Your Work Section */}
        <section className="bg-white rounded border-2 border-border p-8 md:p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h2 className="text-2xl md:text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            We Appreciate and Value Your Work
          </h2>
          <div className="font-crimson text-base md:text-lg leading-relaxed text-primary space-y-4">
            <p>
              Donated art is the engine that drives this train. We understand that art is personal and we will take our safeguarding duties seriously while your work is here. The only designs we have on your work is to make it available to be enjoyed by our monthly donators.
            </p>
            <p>
              We are thrilled to have these works on our site and we don&apos;t require donated art to be original or exclusive (reprints, etc are totally fine). Each author will have a bio section with optional link(s) to where to find other work by the author.
            </p>
          </div>
        </section>

        {/* What We're Looking For Section */}
        <section className="bg-white rounded border-2 border-border p-8 md:p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h2 className="text-2xl md:text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            What We&apos;re Looking For
          </h2>
          <div className="font-crimson text-base md:text-lg leading-relaxed text-primary space-y-4">
            <p>
              Wanting to support organizations tackling mental health issues might be the only thing our monthly donors have in common. As such, we&apos;re hoping to have a wide variety of genres in our stories.
            </p>
            <p>
              We value broad appeal, which means we probably won&apos;t prioritize stories that are graphically violent, political, or explicit. We appreciate that there is great work done in those areas, but it is not what we are looking for here.
            </p>
            <div className="bg-parchment rounded-lg border border-border p-6 my-6">
              <h3 className="font-bold font-garamond text-primary mb-3 text-lg">Submission Guidelines:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">•</span>
                  <span><strong>Length:</strong> 2,000 - 7,000 words (flexible guideline)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">•</span>
                  <span><strong>Format:</strong> Ebook or MS Word (fully edited and ready for publication)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">•</span>
                  <span><strong>Cover:</strong> Submissions with a cover image are preferred</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What Happens After Submission Section */}
        <section className="bg-white rounded border-2 border-border p-8 md:p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h2 className="text-2xl md:text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            What Happens After You Submit a Story
          </h2>
          <div className="font-crimson text-base md:text-lg leading-relaxed text-primary space-y-4">
            <p>
              The team here will review your submission. We will let you know if it was selected (or not) within 2 months. If it is selected, we will also let you know when it will appear on the site.
            </p>
            <p>
              We are not sure how many we will be publishing per month. So it is possible that your work is accepted, but doesn&apos;t appear on the site right away.
            </p>
          </div>
        </section>

        {/* What Happens to Your Donation Section */}
        <section className="bg-white rounded border-2 border-border p-8 md:p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h2 className="text-2xl md:text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            What Happens to Your Donation
          </h2>
          <div className="font-crimson text-base md:text-lg leading-relaxed text-primary space-y-4">
            <p>
              Your donation will be put on the site behind the donator wall as an Ebook. It will be available for any donator to download. If we end up doing a yearly anthology or anything, it will be considered for that as well.
            </p>
            <p className="font-bold text-accent">
              If, for any reason, you should wish to remove your story from the site, we will remove it immediately.
            </p>
          </div>
        </section>

        {/* Contact/Submit Section */}
        <div className="bg-accent text-white rounded-lg border-2 border-primary shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-garamond mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="font-crimson text-base md:text-lg mb-8 max-w-2xl mx-auto">
            We&apos;d love to hear from you! Get in touch with us to submit your work or ask any questions about the submission process.
          </p>
          <a
            href="mailto:submissions@briansbookcase.org"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-accent rounded-lg hover:bg-parchment transition-colors font-semibold text-lg shadow-md"
          >
            <Mail size={24} />
            Contact Us to Submit
          </a>
          <p className="font-crimson text-sm mt-6 opacity-90">
            Or email us at: <strong>submissions@briansbookcase.org</strong>
          </p>
        </div>

        {/* Back to Authors Link */}
        <div className="text-center mt-8">
          <Link href="/authors">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors font-crimson">
              ← Back to Our Authors
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
