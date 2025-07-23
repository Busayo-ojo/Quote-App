import React, { useState, useEffect } from 'react';
import { Heart, Share2, Search, Palette, Calendar, BookOpen, Lightbulb, Target, Smile, Brain, Star, RefreshCw, Copy, Check, TrendingUp, Users, Zap, Settings, Download, Bell, MessageSquare, BarChart3, Sparkles, User, LogOut, Moon, Sun } from 'lucide-react';
import './App.css';

function App() {
  // Core State
  const [currentQuote, setCurrentQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [theme, setTheme] = useState('gradient');
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Advanced State
  const [user, setUser] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [readingStreak, setReadingStreak] = useState(0);
  const [totalQuotesRead, setTotalQuotesRead] = useState(0);
  const [userQuotes, setUserQuotes] = useState([]);
  const [communityQuotes, setCommunityQuotes] = useState([]);
  const [showCommunity, setShowCommunity] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [quoteSentiment, setQuoteSentiment] = useState('');
  const [readingGoal, setReadingGoal] = useState(5);
  const [todayCount, setTodayCount] = useState(0);

  // Analytics State
  const [quoteHistory, setQuoteHistory] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  const quotes = [
    {
      id: 1,
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "motivation",
      tags: ["work", "passion", "success"],
      sentiment: "positive",
      difficulty: "easy",
      length: "short",
      era: "modern",
      rating: 4.8,
      readCount: 1247
    },
    {
      id: 2,
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
      category: "life",
      tags: ["life", "planning", "mindfulness"],
      sentiment: "neutral",
      difficulty: "medium",
      length: "short",
      era: "modern",
      rating: 4.6,
      readCount: 892
    },
    {
      id: 3,
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "inspiration",
      tags: ["dreams", "future", "belief"],
      sentiment: "positive",
      difficulty: "medium",
      length: "medium",
      era: "classic",
      rating: 4.9,
      readCount: 1456
    },
    {
      id: 4,
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      category: "wisdom",
      tags: ["perseverance", "hope", "strength"],
      sentiment: "inspiring",
      difficulty: "hard",
      length: "short",
      era: "ancient",
      rating: 4.7,
      readCount: 967
    },
    {
      id: 5,
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
      category: "motivation",
      tags: ["journey", "beginning", "action"],
      sentiment: "positive",
      difficulty: "easy",
      length: "short",
      era: "modern",
      rating: 4.5,
      readCount: 743
    },
    {
      id: 6,
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
      category: "wisdom",
      tags: ["opportunity", "challenge", "growth"],
      sentiment: "optimistic",
      difficulty: "medium",
      length: "short",
      era: "classic",
      rating: 4.8,
      readCount: 1123
    },
    {
      id: 7,
      text: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      category: "life",
      tags: ["authenticity", "self", "uniqueness"],
      sentiment: "positive",
      difficulty: "easy",
      length: "short",
      era: "classic",
      rating: 4.7,
      readCount: 856
    },
    {
      id: 8,
      text: "Happiness is not something ready made. It comes from your own actions.",
      author: "Dalai Lama",
      category: "happiness",
      tags: ["happiness", "action", "responsibility"],
      sentiment: "positive",
      difficulty: "medium",
      length: "medium",
      era: "modern",
      rating: 4.6,
      readCount: 934
    }
  ];

  const categories = [
    { id: 'all', name: 'All Quotes', icon: BookOpen, color: 'blue' },
    { id: 'motivation', name: 'Motivation', icon: Target, color: 'red' },
    { id: 'life', name: 'Life', icon: Smile, color: 'green' },
    { id: 'inspiration', name: 'Inspiration', icon: Lightbulb, color: 'yellow' },
    { id: 'wisdom', name: 'Wisdom', icon: Brain, color: 'purple' },
    { id: 'happiness', name: 'Happiness', icon: Star, color: 'pink' }
  ];

  const themes = {
    gradient: 'bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600',
    sunset: 'bg-gradient-to-br from-orange-500 via-pink-500 to-red-500',
    forest: 'bg-gradient-to-br from-green-600 via-teal-600 to-blue-600',
    cosmic: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
    ocean: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
    aurora: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600'
  };

  // Initialize app
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    
    // Load user data
    const savedFavorites = localStorage.getItem('quoteAppFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Initialize analytics
    initializeAnalytics();
    loadUserProgress();
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('quoteAppFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const initializeAnalytics = () => {
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
    const todayReads = history.filter(h => new Date(h.date).toDateString() === today).length;
    setTodayCount(todayReads);
    setQuoteHistory(history);
    
    // Calculate category stats
    const stats = {};
    history.forEach(h => {
      stats[h.category] = (stats[h.category] || 0) + 1;
    });
    setCategoryStats(stats);
  };

  const loadUserProgress = () => {
    const streak = parseInt(localStorage.getItem('readingStreak') || '0');
    const total = parseInt(localStorage.getItem('totalQuotesRead') || '0');
    setReadingStreak(streak);
    setTotalQuotesRead(total);
  };

  const simulateAIGeneration = async (prompt) => {
    if (!prompt.trim()) return;
    
    setAiGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiQuotes = [
      {
        id: Date.now(),
        text: `In the pursuit of ${prompt}, remember that every small step creates the path to extraordinary achievements.`,
        author: "AI Wisdom",
        category: "inspiration",
        tags: [prompt.toLowerCase(), "growth", "achievement"],
        sentiment: "positive",
        isAiGenerated: true,
        rating: 4.5,
        readCount: 1
      },
      {
        id: Date.now() + 1,
        text: `${prompt} is not a destination, but a journey that shapes who you become along the way.`,
        author: "AI Insight",
        category: "wisdom",
        tags: [prompt.toLowerCase(), "journey", "growth"],
        sentiment: "inspiring",
        isAiGenerated: true,
        rating: 4.6,
        readCount: 1
      },
      {
        id: Date.now() + 2,
        text: `True ${prompt} comes from understanding that challenges are not obstacles, but opportunities for growth.`,
        author: "AI Philosophy",
        category: "motivation",
        tags: [prompt.toLowerCase(), "challenges", "growth"],
        sentiment: "positive",
        isAiGenerated: true,
        rating: 4.4,
        readCount: 1
      }
    ];
    
    const newQuote = aiQuotes[Math.floor(Math.random() * aiQuotes.length)];
    setCurrentQuote(newQuote);
    setAiGenerating(false);
    recordQuoteRead(newQuote);
    setCustomPrompt('');
  };

  const recordQuoteRead = (quote) => {
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
    
    history.push({
      quoteId: quote.id,
      text: quote.text,
      author: quote.author,
      category: quote.category,
      date: new Date().toISOString(),
      sentiment: quote.sentiment || 'neutral'
    });
    
    localStorage.setItem('quoteHistory', JSON.stringify(history));
    
    // Update counters
    const todayReads = history.filter(h => new Date(h.date).toDateString() === today).length;
    setTodayCount(todayReads);
    
    const newTotal = totalQuotesRead + 1;
    setTotalQuotesRead(newTotal);
    localStorage.setItem('totalQuotesRead', newTotal.toString());
    
    // Update streak logic
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayReads = history.filter(h => 
      new Date(h.date).toDateString() === yesterday.toDateString()
    ).length;
    
    if (todayReads === 1) {
      const newStreak = yesterdayReads > 0 ? readingStreak + 1 : 1;
      setReadingStreak(newStreak);
      localStorage.setItem('readingStreak', newStreak.toString());
    }
    
    // Update category stats
    const stats = {};
    history.forEach(h => {
      stats[h.category] = (stats[h.category] || 0) + 1;
    });
    setCategoryStats(stats);
  };

  const analyzeSentiment = (quote) => {
    const positiveWords = ['love', 'great', 'beautiful', 'hope', 'success', 'happiness', 'joy', 'amazing', 'wonderful'];
    const negativeWords = ['dark', 'difficult', 'impossible', 'failure', 'pain', 'sad', 'hard'];
    
    const text = quote.text.toLowerCase();
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'challenging';
    return 'neutral';
  };

  const getNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const filtered = getFilteredQuotes();
      if (filtered.length > 0) {
        let newQuote;
        do {
          newQuote = filtered[Math.floor(Math.random() * filtered.length)];
        } while (newQuote.id === currentQuote?.id && filtered.length > 1);
        
        setCurrentQuote(newQuote);
        setQuoteSentiment(analyzeSentiment(newQuote));
        recordQuoteRead(newQuote);
      }
      setIsAnimating(false);
    }, 300);
  };

  const getFilteredQuotes = () => {
    let filtered = quotes;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quote => quote.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const toggleFavorite = (quote) => {
    if (favorites.find(fav => fav.id === quote.id)) {
      setFavorites(favorites.filter(fav => fav.id !== quote.id));
    } else {
      setFavorites([...favorites, quote]);
    }
  };

  const shareQuote = async (quote) => {
    const text = `"${quote.text}" - ${quote.author}\n\nShared from Daily Wisdom Pro`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const isFavorite = (quote) => favorites.some(fav => fav.id === quote.id);

  const AnalyticsPanel = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart3 size={24} />
        Your Reading Analytics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{readingStreak}</div>
          <div className="text-white/80 text-sm">Day Streak</div>
        </div>
        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{totalQuotesRead}</div>
          <div className="text-white/80 text-sm">Total Read</div>
        </div>
        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{todayCount}/{readingGoal}</div>
          <div className="text-white/80 text-sm">Today's Goal</div>
        </div>
      </div>
      
      {Object.keys(categoryStats).length > 0 && (
        <div className="bg-white/20 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Category Preferences</h4>
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center mb-2">
              <span className="text-white/90 capitalize">{category}</span>
              <div className="flex items-center gap-2">
                <div className="bg-white/30 rounded-full h-2 w-20">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500" 
                    style={{ width: `${(count / Math.max(...Object.values(categoryStats))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white/80 text-sm">{count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AIGeneratorPanel = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles size={24} />
        AI Quote Generator
      </h3>
      <p className="text-white/80 mb-4">Generate personalized quotes based on your interests or current mood.</p>
      
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter a topic or mood (e.g., 'creativity', 'overcoming fear')"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && simulateAIGeneration(customPrompt)}
          className="flex-1 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-3 rounded-full border border-white/30 focus:outline-none focus:border-white/50"
        />
        <button
          onClick={() => simulateAIGeneration(customPrompt)}
          disabled={!customPrompt.trim() || aiGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2"
        >
          {aiGenerating ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <Zap size={16} />
              Generate
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {['motivation', 'creativity', 'resilience', 'success', 'mindfulness', 'courage'].map(topic => (
          <button
            key={topic}
            onClick={() => setCustomPrompt(topic)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition-all duration-300"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );

  if (!currentQuote) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themes[theme]} ${darkMode ? 'brightness-75' : ''} p-4 transition-all duration-1000`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Enhanced Header with User Info */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
              Daily Wisdom Pro
            </h1>
            <p className="text-white/80 text-lg">AI-Powered Quote Experience</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
            >
              {darkMode ? <Sun className="text-white" size={20} /> : <Moon className="text-white" size={20} />}
            </button>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <User className="text-white" size={16} />
              <span className="text-white text-sm">User #{Math.floor(Math.random() * 1000)}</span>
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <Search size={20} />
            Search
          </button>
          
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <TrendingUp size={20} />
            Analytics
          </button>
          
          <button
            onClick={() => alert('PWA Installation feature - In a real app, this would trigger the install prompt')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <Download size={20} />
            Install App
          </button>
          
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full appearance-none hover:bg-white/30 transition-all duration-300"
            >
              <option value="gradient">Purple Gradient</option>
              <option value="sunset">Sunset</option>
              <option value="forest">Forest</option>
              <option value="cosmic">Cosmic</option>
              <option value="ocean">Ocean</option>
              <option value="aurora">Aurora</option>
            </select>
            <Palette className="absolute right-3 top-2.5 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-8 animate-in slide-in-from-top duration-300">
            <input
              type="text"
              placeholder="Search quotes, authors, tags, or even by sentiment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-6 py-3 rounded-full border border-white/30 focus:outline-none focus:border-white/50 transition-all duration-300"
            />
          </div>
        )}

        {/* Analytics Panel */}
        {showAnalytics && <AnalyticsPanel />}

        {/* AI Generator Panel */}
        <AIGeneratorPanel />

        {/* Enhanced Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white text-gray-800 shadow-lg transform scale-105'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105'
                }`}
              >
                <Icon size={16} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Enhanced Quote Card */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 mb-8 border border-white/20 shadow-2xl transition-all duration-500 ${
          isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="text-center">
            {currentQuote.isAiGenerated && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-4 py-2 rounded-full mb-4 border border-purple-400/30">
                <Sparkles size={16} />
                <span className="text-sm font-medium">AI Generated</span>
              </div>
            )}
            
            <div className="text-6xl text-white/30 mb-4">"</div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed mb-6">
              {currentQuote.text}
            </blockquote>
            <cite className="text-xl md:text-2xl text-white/80 font-medium">
              — {currentQuote.author}
            </cite>
            
            {/* Enhanced Quote Metadata */}
            <div className="flex flex-wrap gap-2 justify-center mt-6 mb-4">
              {currentQuote.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-white/20 text-white/90 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Quote Stats */}
            <div className="flex justify-center gap-6 mt-4 text-white/70 text-sm">
              {currentQuote.rating && (
                <div className="flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  {currentQuote.rating}
                </div>
              )}
              {currentQuote.readCount && (
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {currentQuote.readCount.toLocaleString()} reads
                </div>
              )}
              {quoteSentiment && (
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  {quoteSentiment}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={getNewQuote}
            className="flex items-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
          >
            <RefreshCw size={20} />
            New Quote
          </button>
          
          <button
            onClick={() => toggleFavorite(currentQuote)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 font-medium transform hover:scale-105 ${
              isFavorite(currentQuote)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            <Heart size={20} fill={isFavorite(currentQuote) ? 'currentColor' : 'none'} />
            {isFavorite(currentQuote) ? 'Favorited' : 'Favorite'}
          </button>
          
          <button
            onClick={() => shareQuote(currentQuote)}
            className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 font-medium transform hover:scale-105"
          >
            {copied ? <Check size={20} /> : <Share2 size={20} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          
          <button
            onClick={() => alert('Community features would allow users to discuss this quote')}
            className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 font-medium transform hover:scale-105"
          >
            <MessageSquare size={20} />
            Discuss
          </button>
        </div>

        {/* Enhanced Favorites Section */}
        {favorites.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart size={24} fill="currentColor" />
              Your Favorites ({favorites.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.slice(-6).map(quote => (
                <div
                  key={quote.id}
                  className="bg-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setCurrentQuote(quote)}
                >
                  <p className="text-white/90 text-sm mb-2 line-clamp-2">"{quote.text}"</p>
                  <p className="text-white/70 text-xs mb-2">— {quote.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs capitalize">{quote.category}</span>
                    {quote.isAiGenerated && (
                      <Sparkles className="text-purple-300" size={12} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Today's Reading Progress</h3>
          <div className="bg-white/20 rounded-full h-4 mb-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((todayCount / readingGoal) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-white/80 text-sm">
            {todayCount} of {readingGoal} quotes read today 
            {todayCount >= readingGoal && " 🎉 Goal achieved!"}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p className="text-sm mb-2">
            Start each day with AI-powered inspiration • {new Date().toLocaleDateString()}
          </p>
          <p className="text-xs">
            Advanced Quote App v2.0 | Final Year Project Demo
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;