'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo/Title */}
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Hamzawy</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-end space-x-4 lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/upload-drill">Upload Drill</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/view-workouts">View Workouts</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/generate-workout">Generate Workout</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'fixed inset-x-0 top-[65px] z-50 h-screen bg-background lg:hidden',
            isMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="container flex flex-col space-y-4 p-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/upload-drill">Upload Drill</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/view-workouts">View Workouts</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/generate-workout">Generate Workout</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
