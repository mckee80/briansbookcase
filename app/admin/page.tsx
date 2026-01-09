'use client';

import { useState } from 'react';
import { AdminRoute, useAuth } from '@/components';
import { useData } from '@/contexts/DataContext';
import { extractEbookMetadata } from '@/lib/extractEbookCover';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Book, Users, Trash2, Plus, PieChartIcon } from 'lucide-react';

// Mock membership tier data - in production, this would come from database
const membershipData = [
  { name: 'Free', value: 45, color: '#6B7280' },
  { name: 'Supporter ($5)', value: 30, color: '#8B4513' },
  { name: 'Advocate ($10)', value: 20, color: '#D4A574' },
  { name: 'Champion ($20)', value: 5, color: '#2C1810' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const { ebooks, authors, addEbook, removeEbook, addAuthor, removeAuthor } = useData();
  const [activeTab, setActiveTab] = useState<'ebooks' | 'authors' | 'analytics'>('ebooks');

  // Ebook state
  const [newEbook, setNewEbook] = useState({
    title: '',
    author: '',
    genre: '',
    year: new Date().getFullYear(),
    description: '',
    coverImage: ''
  });
  const [showAddEbook, setShowAddEbook] = useState(false);
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Author state
  const [newAuthor, setNewAuthor] = useState({ name: '' });
  const [showAddAuthor, setShowAddAuthor] = useState(false);

  // Handle ebook file selection and metadata extraction
  const handleEbookFileChange = async (file: File | null) => {
    setEbookFile(file);

    if (file && file.name.toLowerCase().endsWith('.epub')) {
      try {
        const metadata = await extractEbookMetadata(file);

        // Auto-fill title if extracted and field is empty
        if (metadata.title && !newEbook.title) {
          setNewEbook(prev => ({ ...prev, title: metadata.title! }));
        }

        // Auto-fill author if extracted and field is empty
        if (metadata.author && !newEbook.author) {
          setNewEbook(prev => ({ ...prev, author: metadata.author! }));
        }

        // Show extracted metadata in console for debugging
        if (metadata.title || metadata.author) {
          console.log('Auto-filled from EPUB:', {
            title: metadata.title,
            author: metadata.author
          });
        }
      } catch (error) {
        console.error('Error extracting metadata:', error);
      }
    }
  };

  // Ebook management
  const handleAddEbook = async () => {
    if (newEbook.title && newEbook.author && newEbook.genre && ebookFile) {
      setUploading(true);
      try {
        await addEbook(newEbook, ebookFile, coverImageFile || undefined);
        setNewEbook({
          title: '',
          author: '',
          genre: '',
          year: new Date().getFullYear(),
          description: '',
          coverImage: ''
        });
        setEbookFile(null);
        setCoverImageFile(null);
        setShowAddEbook(false);
      } catch (error) {
        alert('Failed to add ebook. Please try again.');
        console.error(error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please fill in all required fields and select an ebook file.');
    }
  };

  const handleRemoveEbook = async (id: number) => {
    if (confirm('Are you sure you want to remove this ebook?')) {
      try {
        await removeEbook(id);
      } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error';
        alert(`Failed to remove ebook: ${errorMessage}`);
        console.error('Full error:', error);
      }
    }
  };

  // Author management
  const handleAddAuthor = async () => {
    if (newAuthor.name.trim()) {
      try {
        await addAuthor({ name: newAuthor.name.trim(), email: '' });
        setNewAuthor({ name: '' });
        setShowAddAuthor(false);
      } catch (error) {
        alert('Failed to add author. Please try again.');
        console.error(error);
      }
    } else {
      alert('Please enter an author name.');
    }
  };

  const handleRemoveAuthor = async (id: number) => {
    const author = authors.find(a => a.id === id);
    if (author && author.booksCount > 0) {
      alert(`Cannot remove ${author.name} - they have ${author.booksCount} book(s) in the library.`);
      return;
    }
    if (confirm('Are you sure you want to remove this author?')) {
      try {
        const success = await removeAuthor(id);
        if (!success) {
          alert('Failed to remove author. Please try again.');
        }
      } catch (error) {
        alert('Failed to remove author. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <AdminRoute>
      <main className="min-h-screen p-8 bg-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold font-garamond mb-2 text-primary">
              Admin Dashboard
            </h1>
            <p className="font-crimson text-lg text-gray-600">
              Manage ebooks, authors, and view membership analytics
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg border-2 border-border shadow-lg mb-6">
            <div className="flex border-b-2 border-border">
              <button
                onClick={() => setActiveTab('ebooks')}
                className={`flex items-center gap-2 px-6 py-4 font-crimson font-semibold transition-colors ${
                  activeTab === 'ebooks'
                    ? 'bg-primary text-parchment border-b-4 border-accent'
                    : 'text-primary hover:bg-parchment'
                }`}
              >
                <Book size={20} />
                Ebooks
              </button>
              <button
                onClick={() => setActiveTab('authors')}
                className={`flex items-center gap-2 px-6 py-4 font-crimson font-semibold transition-colors ${
                  activeTab === 'authors'
                    ? 'bg-primary text-parchment border-b-4 border-accent'
                    : 'text-primary hover:bg-parchment'
                }`}
              >
                <Users size={20} />
                Authors
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-6 py-4 font-crimson font-semibold transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-primary text-parchment border-b-4 border-accent'
                    : 'text-primary hover:bg-parchment'
                }`}
              >
                <PieChartIcon size={20} />
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Ebooks Tab */}
              {activeTab === 'ebooks' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-garamond text-primary">
                      Manage Ebooks ({ebooks.length})
                    </h2>
                    <button
                      onClick={() => setShowAddEbook(!showAddEbook)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
                    >
                      <Plus size={20} />
                      Add Ebook
                    </button>
                  </div>

                  {showAddEbook && (
                    <div className="bg-parchment border-2 border-accent rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold font-garamond mb-4 text-primary">Add New Ebook</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Book Title *"
                          value={newEbook.title}
                          onChange={(e) => setNewEbook({ ...newEbook, title: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="Author Name *"
                          value={newEbook.author}
                          onChange={(e) => setNewEbook({ ...newEbook, author: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="Genre *"
                          value={newEbook.genre}
                          onChange={(e) => setNewEbook({ ...newEbook, genre: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={newEbook.year}
                          onChange={(e) => setNewEbook({ ...newEbook, year: parseInt(e.target.value) })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="mb-4">
                        <textarea
                          placeholder="Description (optional)"
                          value={newEbook.description}
                          onChange={(e) => setNewEbook({ ...newEbook, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold font-crimson text-primary mb-2">
                          Cover Image (optional)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          For EPUB files, the cover will be automatically extracted. Only upload if you want to use a different cover image.
                        </p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        {coverImageFile && (
                          <p className="text-sm text-gray-600 mt-2">
                            Selected: {coverImageFile.name} ({(coverImageFile.size / 1024).toFixed(0)} KB)
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold font-crimson text-primary mb-2">
                          Ebook File (epub, pdf, mobi, etc.)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          For EPUB files, title and author will be automatically extracted if available.
                        </p>
                        <input
                          type="file"
                          accept=".epub,.pdf,.mobi,.azw,.azw3,.txt"
                          onChange={(e) => handleEbookFileChange(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        {ebookFile && (
                          <p className="text-sm text-gray-600 mt-2">
                            Selected: {ebookFile.name} ({(ebookFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddEbook}
                          disabled={uploading}
                          className="px-6 py-2 bg-accent text-white rounded hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploading ? 'Uploading...' : 'Save Ebook'}
                        </button>
                        <button
                          onClick={() => setShowAddEbook(false)}
                          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {ebooks.map((ebook) => (
                      <div
                        key={ebook.id}
                        className="flex items-center justify-between bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h3 className="font-bold font-garamond text-lg text-primary">{ebook.title}</h3>
                          <p className="font-crimson text-gray-600">
                            by {ebook.author} • {ebook.genre} • {ebook.year}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveEbook(ebook.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove ebook"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authors Tab */}
              {activeTab === 'authors' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-garamond text-primary">
                      Manage Authors ({authors.length})
                    </h2>
                    <button
                      onClick={() => setShowAddAuthor(!showAddAuthor)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
                    >
                      <Plus size={20} />
                      Add Author
                    </button>
                  </div>

                  {showAddAuthor && (
                    <div className="bg-parchment border-2 border-accent rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold font-garamond mb-4 text-primary">Add New Author</h3>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Author Name"
                          value={newAuthor.name}
                          onChange={(e) => setNewAuthor({ name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddAuthor}
                          className="px-6 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
                        >
                          Save Author
                        </button>
                        <button
                          onClick={() => setShowAddAuthor(false)}
                          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {authors.map((author) => (
                      <div
                        key={author.id}
                        className="flex items-center justify-between bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h3 className="font-bold font-garamond text-lg text-primary">{author.name}</h3>
                          <p className="font-crimson text-gray-600">
                            {author.booksCount} book(s)
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveAuthor(author.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove author"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  <h2 className="text-2xl font-bold font-garamond text-primary mb-6">
                    Membership Tier Distribution
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="bg-white border border-border rounded-lg p-6">
                      <h3 className="text-xl font-bold font-garamond text-primary mb-4 text-center">
                        Member Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={membershipData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {membershipData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-garamond text-primary mb-4">
                        Tier Statistics
                      </h3>
                      {membershipData.map((tier) => (
                        <div
                          key={tier.name}
                          className="bg-white border border-border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: tier.color }}
                              />
                              <span className="font-bold font-garamond text-primary">
                                {tier.name}
                              </span>
                            </div>
                            <span className="font-crimson font-bold text-accent">
                              {tier.value} members
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(tier.value / membershipData.reduce((a, b) => a + b.value, 0)) * 100}%`,
                                backgroundColor: tier.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="bg-parchment border-2 border-accent rounded-lg p-6 mt-6">
                        <h4 className="font-bold font-garamond text-primary mb-3">Summary</h4>
                        <div className="space-y-2 font-crimson text-gray-700">
                          <p>
                            <strong>Total Members:</strong>{' '}
                            {membershipData.reduce((a, b) => a + b.value, 0)}
                          </p>
                          <p>
                            <strong>Paying Members:</strong>{' '}
                            {membershipData.filter(t => !t.name.includes('Free')).reduce((a, b) => a + b.value, 0)}
                          </p>
                          <p>
                            <strong>Free Members:</strong>{' '}
                            {membershipData.find(t => t.name.includes('Free'))?.value || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminRoute>
  );
}
