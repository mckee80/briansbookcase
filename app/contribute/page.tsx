'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, Check } from 'lucide-react';

const GENRES = [
  'Literary Fiction',
  'Mystery/Thriller',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Horror',
  'Historical Fiction',
  'Adventure',
  'Humor/Satire',
  'Other',
];

export default function Contribute() {
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const name = selected.name.toLowerCase();
      if (!name.endsWith('.epub') && !name.endsWith('.doc') && !name.endsWith('.docx')) {
        setError('Please upload an .epub, .doc, or .docx file');
        setFile(null);
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError('File must be under 10MB');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authorName || !email || selectedGenres.length === 0 || !file) {
      setError('Please fill in all fields, select at least one genre, and upload your story.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('authorName', authorName);
      formData.append('email', email);
      formData.append('genres', selectedGenres.join(', '));
      formData.append('file', file);

      const res = await fetch('/api/submit-story', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
      setAuthorName('');
      setEmail('');
      setSelectedGenres([]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-garamond mb-4 text-primary">
            Become a Contributing Author
          </h1>
          <p className="font-crimson text-lg text-gray-700">
            Share your fiction to support mental health awareness
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
            <div className="bg-parchment rounded-lg border border-border p-6 my-6">
              <h3 className="font-bold font-garamond text-primary mb-3 text-lg">Submission Guidelines:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">&bull;</span>
                  <span><strong>Type:</strong> Fiction — all genres welcome (literary, mystery, sci-fi, romance, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">&bull;</span>
                  <span><strong>Length:</strong> 2,000 - 7,000 words (flexible guideline)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">&bull;</span>
                  <span><strong>Format:</strong> Ebook or MS Word (fully edited and ready for publication)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 font-bold">&bull;</span>
                  <span><strong>Cover:</strong> We can help you with a cover</span>
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

        {/* Submission Form */}
        <section className="bg-white rounded border-2 border-border p-8 md:p-12 mb-8 shadow-[0_2px_12px_rgba(44,24,16,0.12)] relative page-corner">
          <h2 className="text-2xl md:text-3xl font-bold font-garamond mb-6 text-primary border-b-2 border-border pb-3">
            Submit Your Story
          </h2>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <Check size={48} className="mx-auto mb-4 text-green-600" />
              <h3 className="font-garamond text-xl font-bold text-green-800 mb-2">
                Story Submitted!
              </h3>
              <p className="font-crimson text-lg text-green-700">
                Thank you for your submission! We&apos;ll review it and get back to you within 2 months.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2 bg-accent text-white rounded hover:bg-primary transition-colors font-crimson"
              >
                Submit Another Story
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-crimson">
                  {error}
                </div>
              )}

              {/* Author Name */}
              <div>
                <label htmlFor="authorName" className="block font-crimson text-lg text-primary mb-2 font-semibold">
                  Author Name
                </label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded font-crimson text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="Your name or pen name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-crimson text-lg text-primary mb-2 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded font-crimson text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Genre Multi-Select */}
              <div>
                <label className="block font-crimson text-lg text-primary mb-3 font-semibold">
                  Genre(s)
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-full border-2 font-crimson text-sm transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-accent text-white border-accent'
                          : 'bg-parchment text-primary border-border hover:border-accent'
                      }`}
                    >
                      {selectedGenres.includes(genre) && <Check size={14} className="inline mr-1 -mt-0.5" />}
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block font-crimson text-lg text-primary mb-2 font-semibold">
                  Upload Your Story
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
                >
                  <Upload size={32} className="mx-auto mb-3 text-accent" />
                  {file ? (
                    <p className="font-crimson text-primary">
                      <span className="font-semibold">{file.name}</span>
                      <span className="text-gray-500 ml-2">({(file.size / 1024).toFixed(0)} KB)</span>
                    </p>
                  ) : (
                    <>
                      <p className="font-crimson text-primary font-semibold">Click to upload your story</p>
                      <p className="font-crimson text-gray-500 text-sm mt-1">.epub, .doc, or .docx (max 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".epub,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-accent text-white rounded font-semibold text-lg font-crimson hover:bg-primary transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Your Story'}
              </button>
            </form>
          )}
        </section>

        {/* Back to Authors Link */}
        <div className="text-center mt-8">
          <Link href="/authors">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors font-crimson">
              &larr; Back to Our Authors
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
