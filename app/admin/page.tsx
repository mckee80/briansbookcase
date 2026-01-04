'use client';

import { useState, useEffect } from 'react';
import { AdminRoute, useAuth } from '@/components';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Book, Users, Trash2, Plus, PieChartIcon } from 'lucide-react';

// Mock data for initial state
const initialEbooks = [
  { id: 1, title: 'Whispers of Tomorrow', author: 'Sarah Mitchell', genre: 'Science Fiction', year: 2024 },
  { id: 2, title: 'The Silent Echo', author: 'James Parker', genre: 'Mystery', year: 2023 },
  { id: 3, title: 'Beyond the Horizon', author: 'Sarah Mitchell', genre: 'Adventure', year: 2024 },
  { id: 4, title: 'The Lighthouse Song', author: 'Maria Rodriguez', genre: 'Romance', year: 2023 },
];

const initialAuthors = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@example.com', booksCount: 2 },
  { id: 2, name: 'James Parker', email: 'james@example.com', booksCount: 1 },
  { id: 3, name: 'Maria Rodriguez', email: 'maria@example.com', booksCount: 1 },
];

// Mock membership tier data - in production, this would come from database
const membershipData = [
  { name: 'Free', value: 45, color: '#6B7280' },
  { name: 'Supporter ($5)', value: 30, color: '#8B4513' },
  { name: 'Advocate ($10)', value: 20, color: '#D4A574' },
  { name: 'Champion ($20)', value: 5, color: '#2C1810' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ebooks' | 'authors' | 'analytics'>('ebooks');

  // Ebook state
  const [ebooks, setEbooks] = useState(initialEbooks);
  const [newEbook, setNewEbook] = useState({ title: '', author: '', genre: '', year: new Date().getFullYear() });
  const [showAddEbook, setShowAddEbook] = useState(false);

  // Author state
  const [authors, setAuthors] = useState(initialAuthors);
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '' });
  const [showAddAuthor, setShowAddAuthor] = useState(false);

  // Ebook management
  const handleAddEbook = () => {
    if (newEbook.title && newEbook.author && newEbook.genre) {
      const ebook = {
        id: Math.max(...ebooks.map(e => e.id), 0) + 1,
        ...newEbook,
      };
      setEbooks([...ebooks, ebook]);
      setNewEbook({ title: '', author: '', genre: '', year: new Date().getFullYear() });
      setShowAddEbook(false);
    }
  };

  const handleRemoveEbook = (id: number) => {
    if (confirm('Are you sure you want to remove this ebook?')) {
      setEbooks(ebooks.filter(e => e.id !== id));
    }
  };

  // Author management
  const handleAddAuthor = () => {
    if (newAuthor.name && newAuthor.email) {
      const author = {
        id: Math.max(...authors.map(a => a.id), 0) + 1,
        ...newAuthor,
        booksCount: 0,
      };
      setAuthors([...authors, author]);
      setNewAuthor({ name: '', email: '' });
      setShowAddAuthor(false);
    }
  };

  const handleRemoveAuthor = (id: number) => {
    const author = authors.find(a => a.id === id);
    if (author && author.booksCount > 0) {
      alert(`Cannot remove ${author.name} - they have ${author.booksCount} book(s) in the library.`);
      return;
    }
    if (confirm('Are you sure you want to remove this author?')) {
      setAuthors(authors.filter(a => a.id !== id));
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
                          placeholder="Book Title"
                          value={newEbook.title}
                          onChange={(e) => setNewEbook({ ...newEbook, title: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="Author Name"
                          value={newEbook.author}
                          onChange={(e) => setNewEbook({ ...newEbook, author: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="Genre"
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
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddEbook}
                          className="px-6 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
                        >
                          Save Ebook
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
                          placeholder="Author Name"
                          value={newAuthor.name}
                          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={newAuthor.email}
                          onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
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
                            {author.email} • {author.booksCount} book(s)
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
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
