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
  const [activeTab, setActiveTab] = useState<'ebooks' | 'authors' | 'analytics' | 'users'>('ebooks');

  // Membership data state
  const [membershipData, setMembershipData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loadingMembership, setLoadingMembership] = useState(false);

  // Analytics state
  const [signupsPerWeek, setSignupsPerWeek] = useState<Array<{ week_start: string; signup_count: number }>>([]);
  const [tierChanges, setTierChanges] = useState<Array<{ old_tier: string; new_tier: string; change_count: number }>>([]);
  const [accountDeletions, setAccountDeletions] = useState<number>(0);
  const [bookStats, setBookStats] = useState<Array<{
    ebook_id: number;
    title: string;
    author: string;
    download_count: number;
    send_count: number;
    total_activity: number;
  }>>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // User management state
  const [users, setUsers] = useState<Array<{
    id: string;
    email: string;
    email_confirmed_at: string | null;
    created_at: string;
    membership_tier: string;
  }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null);

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

  // Fetch advanced analytics data
  const fetchAdvancedAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      // Fetch signups per week
      const { data: signupData, error: signupError } = await supabase.rpc('get_signups_per_week', { weeks_back: 12 });
      if (!signupError && signupData) {
        setSignupsPerWeek(signupData);
      }

      // Fetch tier changes
      const { data: tierChangeData, error: tierChangeError } = await supabase.rpc('get_tier_changes_summary', { days_back: 30 });
      if (!tierChangeError && tierChangeData) {
        setTierChanges(tierChangeData);
      }

      // Fetch account deletions count
      const { count: deletionCount, error: deletionError } = await supabase
        .from('account_deletions')
        .select('*', { count: 'exact', head: true });
      if (!deletionError && deletionCount !== null) {
        setAccountDeletions(deletionCount);
      }

      // Fetch book stats
      const { data: bookStatsData, error: bookStatsError } = await supabase.rpc('get_book_download_stats');
      if (!bookStatsError && bookStatsData) {
        setBookStats(bookStatsData);
      }
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch users for user management
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_admin');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Manually verify a user's email
  const handleVerifyEmail = async (userId: string, userEmail: string) => {
    setVerifyingEmail(userId);
    try {
      const { error } = await supabase.rpc('admin_verify_user_email', {
        user_id: userId
      });

      if (error) {
        alert(`Failed to verify email: ${error.message}`);
        return;
      }

      alert(`Email verified successfully for ${userEmail}`);

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      alert('Failed to verify email. Please try again.');
      console.error(error);
    } finally {
      setVerifyingEmail(null);
    }
  };

  // Fetch membership data when analytics tab is opened
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchMembershipData();
      fetchAdvancedAnalytics();
    } else if (activeTab === 'users') {
      fetchUsers();
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
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-4 font-crimson font-semibold transition-colors ${
                  activeTab === 'users'
                    ? 'bg-primary text-parchment border-b-4 border-accent'
                    : 'text-primary hover:bg-parchment'
                }`}
              >
                <Users size={20} />
                Users
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

                  {/* New Analytics Sections */}
                  {!loadingAnalytics && (
                    <>
                      {/* Signups Per Week */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold font-garamond text-primary mb-6">
                          User Signups (Last 12 Weeks)
                        </h2>
                        <div className="bg-white border border-border rounded-lg p-6">
                          {signupsPerWeek.length > 0 ? (
                            <div className="space-y-3">
                              {signupsPerWeek.map((week) => (
                                <div key={week.week_start} className="flex justify-between items-center p-3 bg-parchment rounded">
                                  <span className="font-crimson text-primary">
                                    Week of {new Date(week.week_start).toLocaleDateString()}
                                  </span>
                                  <span className="font-bold font-garamond text-accent">
                                    {week.signup_count} signups
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="font-crimson text-gray-600 text-center py-8">
                              No signup data available yet.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tier Changes */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold font-garamond text-primary mb-6">
                          Membership Tier Changes (Last 30 Days)
                        </h2>
                        <div className="bg-white border border-border rounded-lg p-6">
                          {tierChanges.length > 0 ? (
                            <div className="space-y-3">
                              {tierChanges.map((change, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-parchment rounded">
                                  <span className="font-crimson text-primary">
                                    {change.old_tier || 'New User'} → {change.new_tier}
                                  </span>
                                  <span className="font-bold font-garamond text-accent">
                                    {change.change_count} changes
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="font-crimson text-gray-600 text-center py-8">
                              No tier changes in the last 30 days.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Account Deletions */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold font-garamond text-primary mb-6">
                          Account Deletions
                        </h2>
                        <div className="bg-white border border-border rounded-lg p-6">
                          <p className="font-crimson text-gray-700 text-center">
                            <span className="text-3xl font-bold font-garamond text-red-600 block mb-2">
                              {accountDeletions}
                            </span>
                            Total accounts deleted
                          </p>
                        </div>
                      </div>

                      {/* Book Download Stats */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold font-garamond text-primary mb-6">
                          Book Activity Statistics
                        </h2>
                        <div className="bg-white border border-border rounded-lg p-6">
                          {bookStats.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b-2 border-border">
                                    <th className="text-left py-3 px-4 font-garamond text-primary">Title</th>
                                    <th className="text-left py-3 px-4 font-garamond text-primary">Author</th>
                                    <th className="text-center py-3 px-4 font-garamond text-primary">Downloads</th>
                                    <th className="text-center py-3 px-4 font-garamond text-primary">Sends</th>
                                    <th className="text-center py-3 px-4 font-garamond text-primary">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {bookStats.map((book) => (
                                    <tr key={book.ebook_id} className="border-b border-gray-200 hover:bg-parchment">
                                      <td className="py-3 px-4 font-crimson text-primary">{book.title}</td>
                                      <td className="py-3 px-4 font-crimson text-gray-700">{book.author}</td>
                                      <td className="py-3 px-4 font-crimson text-center text-accent font-bold">
                                        {book.download_count}
                                      </td>
                                      <td className="py-3 px-4 font-crimson text-center text-accent font-bold">
                                        {book.send_count}
                                      </td>
                                      <td className="py-3 px-4 font-crimson text-center text-primary font-bold">
                                        {book.total_activity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="font-crimson text-gray-600 text-center py-8">
                              No book activity tracked yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold font-garamond text-primary mb-6">
                    User Management
                  </h2>

                  {loadingUsers ? (
                    <div className="text-center py-16">
                      <p className="font-crimson text-xl text-gray-600">
                        Loading users...
                      </p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="font-crimson text-xl text-gray-600">
                        No users found.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white border border-border rounded-lg p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-border">
                              <th className="text-left py-3 px-4 font-garamond text-primary">Email</th>
                              <th className="text-left py-3 px-4 font-garamond text-primary">Tier</th>
                              <th className="text-center py-3 px-4 font-garamond text-primary">Verified</th>
                              <th className="text-center py-3 px-4 font-garamond text-primary">Joined</th>
                              <th className="text-center py-3 px-4 font-garamond text-primary">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((userItem) => (
                              <tr key={userItem.id} className="border-b border-gray-200 hover:bg-parchment">
                                <td className="py-3 px-4 font-crimson text-primary">{userItem.email}</td>
                                <td className="py-3 px-4 font-crimson text-gray-700">
                                  {userItem.membership_tier || 'Free'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {userItem.email_confirmed_at ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                      Unverified
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-crimson text-center text-gray-700">
                                  {new Date(userItem.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {!userItem.email_confirmed_at && (
                                    <button
                                      onClick={() => handleVerifyEmail(userItem.id, userItem.email)}
                                      disabled={verifyingEmail === userItem.id}
                                      className="px-3 py-1 bg-accent text-white rounded hover:bg-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {verifyingEmail === userItem.id ? 'Verifying...' : 'Verify Email'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
