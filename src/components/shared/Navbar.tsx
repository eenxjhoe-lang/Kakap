"use client"

import Link from "next/link";
import { Ship, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Ship className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-primary leading-tight">KAKAP</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Dashboard Monitoring</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Beranda</Link>
            <Link href="/#statistik" className="text-sm font-medium transition-colors hover:text-primary">Statistik</Link>
            <Link href="/#kontak" className="text-sm font-medium transition-colors hover:text-primary">Kontak</Link>
            <div className="h-6 w-[1px] bg-border mx-2" />
            <Link 
              href="/login" 
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors gap-2"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <Link href="/" className="block text-sm font-medium">Beranda</Link>
          <Link href="/#statistik" className="block text-sm font-medium">Statistik</Link>
          <Link href="/#kontak" className="block text-sm font-medium">Kontak</Link>
          <Link 
            href="/login" 
            className="flex h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold gap-2"
          >
            <LogIn className="h-4 w-4" />
            Masuk
          </Link>
        </div>
      )}
    </nav>
  );
}
