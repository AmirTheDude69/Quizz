'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, Zap, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useCategories, useTopics, useFeaturedTopics } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Input, Button, Loading } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function PlayPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured' | 'new' | 'popular'>('all');
  
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { topics, total, isLoading: topicsLoading } = useTopics(selectedCategory || undefined);
  const { topics: featuredTopics, isLoading: featuredLoading } = useFeaturedTopics();

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'featured' && topic.featured) ||
      (filter === 'new' && topic.isNew);
    return matchesSearch && matchesFilter;
  });

  const displayTopics = filter === 'featured' ? featuredTopics : filteredTopics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Play Quizz</h1>
          <p className="text-gray-400 mt-1">Choose a topic and test your knowledge</p>
        </div>
        <Link href="/play/quick">
          <Button size="lg" className="w-full lg:w-auto">
            <Zap size={20} className="mr-2" />
            Quick Play
          </Button>
        </Link>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'featured', 'new', 'popular'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-white mb-3">Categories</h2>
        {categoriesLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-background-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={cn(
                    'group relative w-full h-24 rounded-xl overflow-hidden cursor-pointer transition-all',
                    'border-2',
                    selectedCategory === category.id 
                      ? 'border-primary-500' 
                      : 'border-transparent hover:border-primary-500/50'
                  )}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: `${category.icon}15` }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl mb-1">{category.icon}</span>
                    <span className="font-medium text-white text-sm">{category.name}</span>
                    <span className="text-xs text-gray-400 mt-1">{category.topicCount} topics</span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            {selectedCategory ? 'Filtered Topics' : 'All Topics'}
            {total > 0 && <span className="text-gray-400 ml-2">({total})</span>}
          </h2>
          {selectedCategory && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              Clear Filter
            </Button>
          )}
        </div>
        
        {topicsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-background-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : displayTopics.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/play/${topic.slug}`}>
                  <Card hover glow className="h-full">
                    <div className="relative h-32 rounded-t-xl overflow-hidden">
                      <div 
                        className="absolute inset-0"
                        style={{ backgroundColor: `${topic.iconColor}20` }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl mb-2">{topic.icon}</span>
                      </div>
                      {topic.featured && (
                        <Badge variant="warning" className="absolute top-2 right-2">
                          <TrendingUp size={12} className="mr-1" />
                          Trending
                        </Badge>
                      )}
                      {topic.isNew && (
                        <Badge variant="info" className="absolute top-2 left-2">
                          <Sparkles size={12} className="mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white truncate">{topic.name}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                        <span>{topic.questionCount} questions</span>
                        <span>•</span>
                        <span>{topic.playCount.toLocaleString()} plays</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No topics found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
