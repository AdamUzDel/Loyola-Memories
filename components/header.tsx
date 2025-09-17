"use client"

import { useState } from "react"
import { Search, Menu, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onSearch?: (query: string) => void
  onFilterToggle?: () => void
}

export function Header({ onSearch, onFilterToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Loyola Memories</h1>
              <p className="text-sm text-muted-foreground">Secondary School - Wau</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#albums" className="text-foreground hover:text-primary transition-colors">
              Albums
            </a>
            <a href="#events" className="text-foreground hover:text-primary transition-colors">
              Events
            </a>
            <a href="#years" className="text-foreground hover:text-primary transition-colors">
              Years
            </a>
            <a href="/admin" className="text-foreground hover:text-primary transition-colors">
              Admin
            </a>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search memories..."
                  className="w-48 pl-10"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              {onFilterToggle && (
                <Button variant="outline" size="icon" onClick={onFilterToggle}>
                  <Filter className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <div className="sm:hidden flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search memories..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                {onFilterToggle && (
                  <Button variant="outline" size="icon" onClick={onFilterToggle}>
                    <Filter className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <a href="#albums" className="text-foreground hover:text-primary transition-colors">
                Albums
              </a>
              <a href="#events" className="text-foreground hover:text-primary transition-colors">
                Events
              </a>
              <a href="#years" className="text-foreground hover:text-primary transition-colors">
                Years
              </a>
              <a href="/admin" className="text-foreground hover:text-primary transition-colors">
                Admin
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
