'use client';

import { useState, useEffect } from 'react';
import { AdminRoute, useAuth } from '@/components';
import { useData } from '@/contexts/DataContext';
import { extractEbookMetadata } from '@/lib/extractEbookCover';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Book, Users, Trash2, Plus, PieChartIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Color mapping for membership tiers
const tierColors: Record<string, string> = {
  'free': '#6B7280',
  'supporter': '#8B4513',
  'advocate': '#D4A574',
  'champion': '#2C1810',
};

// Tier display names with prices
const tierNames: Record<string, string> = {
  'free': 'Free',
  'supporter': 'Supporter ($5)',
  'advocate': 'Advocate ($10)',
  'champion': 'Champion ($20)',
};

export default function AdminPage() {
  const { user } = useAuth();
  const { ebooks, authors, addEbook, removeEbook, addAuthor, updateAuthor, removeAuthor } = useData();
  const [activeTab, setActiveTab] = useState<'ebooks' | 'authors' | 'analytics'>('ebooks');

  // Membership data state
  const [membershipData, setMembershipData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loadingMembership, setLoadingMembership] = useState(false);

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
  const [newAuthor, setNewAuthor] = useState({ name: '', bio: '', email: '' });
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [authorPhotoFile, setAuthorPhotoFile] = useState<File | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<number | null>(null);
  const [editAuthorData, setEditAuthorData] = useState({ bio: '', email: '', photoUrl: '' });

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
        await addAuthor({
          name: newAuthor.name.trim(),
          email: newAuthor.email || '',
          bio: newAuthor.bio || undefined
        });

        // If a photo was uploaded, update the author with the photo
        if (authorPhotoFile) {
          const addedAuthor = authors.find(a => a.name === newAuthor.name.trim());
          if (addedAuthor) {
            await updateAuthor(addedAuthor.id, {}, authorPhotoFile);
          }
        }

        setNewAuthor({ name: '', bio: '', email: '' });
        setAuthorPhotoFile(null);
        setShowAddAuthor(false);
      } catch (error) {
        alert('Failed to add author. Please try again.');
        console.error(error);
      }
    } else {
      alert('Please enter an author name.');
    }
  };

  const handleUpdateAuthor = async (authorId: number) => {
    try {
      await updateAuthor(authorId, {
        bio: editAuthorData.bio || undefined,
        email: editAuthorData.email || undefined,
      }, authorPhotoFile || undefined);

      setEditingAuthor(null);
      setEditAuthorData({ bio: '', email: '', photoUrl: '' });
      setAuthorPhotoFile(null);
    } catch (error) {
      alert('Failed to update author. Please try again.');
      console.error(error);
    }
  };

  // Fetch real membership data from Supabase
  const fetchMembershipData = async () => {
    setLoadingMembership(true);
    try {
      // Call the RPC function to get membership statistics
      const { data, error } = await supabase.rpc('get_membership_stats');

      if (error) throw error;

      if (!data || data.length === 0) {
        // No users yet
        setMembershipData([]);
        return;
      }

      // Convert database results to chart format
      const chartData = data
        .map((row: { tier: string; count: number }) => ({
          name: tierNames[row.tier] || row.tier,
          value: Number(row.count),
          color: tierColors[row.tier] || '#6B7280',
        }))
        .filter((item: { name: string; value: number; color: string }) => item.value > 0); // Only include tiers with users

      setMembershipData(chartData);
    } catch (error) {
      console.error('Error fetching membership data:', error);
      // Set empty data if fetch fails
      setMembershipData([]);
    } finally {
      setLoadingMembership(false);
    }
  };

  // Fetch membership data when analytics tab is opened
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchMembershipData();
    }
  }, [activeTab]);

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
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Author Name *"
                          value={newAuthor.name}
                          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          value={newAuthor.email}
                          onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="mb-4">
                        <textarea
                          placeholder="Bio (optional)"
                          value={newAuthor.bio}
                          onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold font-crimson text-primary mb-2">
                          Author Photo (optional)
                        </label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={(e) => setAuthorPhotoFile(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        {authorPhotoFile && (
                          <p className="text-sm text-gray-600 mt-2">
                            Selected: {authorPhotoFile.name}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddAuthor}
                          className="px-6 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
                        >
                          Save Author
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAuthor(false);
                            setNewAuthor({ name: '', bio: '', email: '' });
                            setAuthorPhotoFile(null);
                          }}
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
                        className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {editingAuthor === author.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="email"
                                placeholder="Email"
                                value={editAuthorData.email}
                                onChange={(e) => setEditAuthorData({ ...editAuthorData, email: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                            </div>
                            <textarea
                              placeholder="Bio"
                              value={editAuthorData.bio}
                              onChange={(e) => setEditAuthorData({ ...editAuthorData, bio: e.target.value })}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <div>
                              <label className="block text-sm font-semibold font-crimson text-primary mb-2">
                                Update Photo
                              </label>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => setAuthorPhotoFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateAuthor(author.id)}
                                className="px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingAuthor(null);
                                  setEditAuthorData({ bio: '', email: '', photoUrl: '' });
                                  setAuthorPhotoFile(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {author.photoUrl ? (
                                <img
                                  src={author.photoUrl}
                                  alt={author.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl font-bold text-accent">
                                  {author.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-bold font-garamond text-lg text-primary">{author.name}</h3>
                                <p className="font-crimson text-gray-600 text-sm">
                                  {author.booksCount} book(s) • {author.email || 'No email'}
                                </p>
                                {author.bio && (
                                  <p className="font-crimson text-gray-700 text-sm mt-1 italic">
                                    {author.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingAuthor(author.id);
                                  setEditAuthorData({
                                    bio: author.bio || '',
                                    email: author.email || '',
                                    photoUrl: author.photoUrl || '',
                                  });
                                }}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleRemoveAuthor(author.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove author"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        )}
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

                  {loadingMembership ? (
                    <div className="text-center py-16">
                      <p className="font-crimson text-xl text-gray-600">
                        Loading membership data...
                      </p>
                    </div>
                  ) : membershipData.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="font-crimson text-xl text-gray-600">
                        No membership data available yet.
                      </p>
                    </div>
                  ) : (
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminRoute>
  );
}
