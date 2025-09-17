import { Button } from "@/components/ui/button"
import { Calendar, Camera } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Preserving Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              {" "}
              Memories
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            A digital archive of precious moments from Loyola Secondary School, Wau. Relive the joy, celebrate
            achievements, and cherish friendships that shaped our journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-medium">
              <Camera className="w-5 h-5 mr-2" />
              Explore Albums
            </Button>
            <Button variant="outline" size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              Browse by Year
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Albums</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
