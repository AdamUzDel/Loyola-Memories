"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ImageIcon, Search } from "lucide-react"

interface SearchResult {
  id: number
  title: string
  description: string
  coverImage: string
  photoCount: number
  date: string
  category: string
  type: "album" | "photo"
  matchedText?: string
}

interface SearchResultsProps {
  query: string
  results: SearchResult[]
  isLoading?: boolean
}

export function SearchResults({ query, results, isLoading }: SearchResultsProps) {
  if (!query && results.length === 0) {
    return null
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Search Results {query && `for "${query}"`}</h2>
          </div>
          <p className="text-muted-foreground">
            {results.length === 0
              ? "No results found. Try adjusting your search terms or filters."
              : `Found ${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <Link key={`${result.type}-${result.id}`} href={`/album/${result.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={result.coverImage || "/placeholder.svg"}
                      alt={result.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {result.photoCount}
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-amber-600 text-white">
                        {result.type}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-2 text-balance">
                      {result.title}
                      {result.matchedText && (
                        <span className="text-sm text-muted-foreground block font-normal">
                          ...{result.matchedText}...
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 text-pretty">{result.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
