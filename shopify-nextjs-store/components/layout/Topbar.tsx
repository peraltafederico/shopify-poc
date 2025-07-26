'use client';

import { useState } from 'react';

export default function Topbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl md:ml-0 ml-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full bg-stone-100 px-5 py-2.5 pl-12 text-sm placeholder-stone-500 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Search Suggestions */}
          {isSearchOpen && (
            <div className="absolute mt-2 w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl border border-stone-200 animate-fade-in">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Popular Searches</p>
              <div className="space-y-2">
                <button className="flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-left hover:bg-stone-50 transition-colors">
                  <span className="text-earth-600">🏔️</span>
                  <span className="text-sm">Mountain gear</span>
                </button>
                <button className="flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-left hover:bg-stone-50 transition-colors">
                  <span className="text-forest-600">🌲</span>
                  <span className="text-sm">Forest exploration</span>
                </button>
                <button className="flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-left hover:bg-stone-50 transition-colors">
                  <span className="text-sky-600">🌊</span>
                  <span className="text-sm">Water adventures</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-stone-600 hover:bg-stone-100 transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-earth-500 ring-2 ring-white"></span>
          </button>

          {/* User Menu */}
          <button className="flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-stone-100 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-stone-900">John Doe</p>
              <p className="text-xs text-stone-500">Explorer</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-screen bg-white z-50">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-20 px-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1">
              <a 
                href="/" 
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-900 hover:bg-forest-50 transition-colors"
              >
                <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Explore</span>
              </a>
              <a 
                href="/gallery" 
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-900 hover:bg-forest-50 transition-colors"
              >
                <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Gallery</span>
              </a>
              <a 
                href="/reviews" 
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-900 hover:bg-forest-50 transition-colors"
              >
                <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Reviews</span>
              </a>
            </nav>
        </div>
      )}
    </header>
  );
}