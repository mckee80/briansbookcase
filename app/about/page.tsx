import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-garamond mb-4 text-primary">
            About Brian&apos;s Bookcase
          </h1>
          <p className="font-crimson text-lg text-textLight">
            Learn about our mission and the story behind Brian&apos;s Bookcase
          </p>
        </div>

        {/* Our Story Section */}
        <section className="bg-white rounded border-2 border-border p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h3 className="text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            Our Story
          </h3>
          <div className="font-crimson text-lg leading-relaxed text-primary space-y-6">
            <p className="drop-cap">
              My brother, Brian, was a writer. He loved stories and believed in their power to inspire or connect or soothe. It was his avocation rather than his occupation, though that wasn't his choice. He was known for his goofy sense of humor, his deep empathy, and his ability to connect with others. Not many people knew of the mental health struggles that shaped most of his adult life.
            </p>
            <p>
              When he passed to suicide in 2011, he left behind a treasure trove of memories, mental snapshots, sayings, traditions … and a book. His thesis in graduate school was a novel, and for seven years, it sat in his house. Then it sat in mine for another thirteen years. I've read it several times over the years. It sounds like him. It helps me keep his memory fresh.
            </p>
            <p>
              I wanted to do something meaningful to honor his memory and allow other people to enjoy his quirky style. I decided to self-publish his book and donate every penny to mental health charities.
            </p>
            <p>
              There are a lot of people out there that have a gift of imagination and storytelling. This inspired us to expand our mission: to create a place where we could celebrate stories and support mental health causes. Brian believed in the power of stories to connect people and allow them to relate to one another. I know my brother would be proud to use his stories (both real life and fictional) to help others that are suffering like he did.
            </p>
            <p>
              I created this site, in part, to transform my support from occasional actions into a consistent part of my life. With every hour I work and every dollar I earn, a tiny piece goes towards helping those impacted by the struggles my brother faced.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-white rounded border-2 border-border p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h3 className="text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            Our Mission
          </h3>
          <p className="font-crimson text-lg leading-relaxed text-primary">
            Brian&apos;s Bookcase is a non-profit organization dedicated to supporting mental health and suicide prevention efforts. We foster community by offering donated short stories, creating a platform that entertains and inspires while empowering the critical work of mental health organizations.
          </p>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/authors">
            <button className="px-8 py-3 bg-accent text-white rounded font-semibold uppercase text-sm tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,69,19,0.4)]">
              Meet Our Donating Authors
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
