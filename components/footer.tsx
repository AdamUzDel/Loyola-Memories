import { Heart, Mail, Phone, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <h3 className="font-semibold text-foreground">Loyola Secondary School</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Preserving precious memories and celebrating the journey of education in Wau, South Sudan.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <a
                href="https://lss.esomero.bytebasetech.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Visit School Website
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#albums" className="block text-muted-foreground hover:text-primary transition-colors">
                Albums
              </a>
              <a href="#events" className="block text-muted-foreground hover:text-primary transition-colors">
                Events
              </a>
              <a href="#years" className="block text-muted-foreground hover:text-primary transition-colors">
                Years
              </a>
              <a href="/admin" className="block text-muted-foreground hover:text-primary transition-colors">
                Admin Panel
              </a>
            </div>
          </div>

          {/* Credits */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Designed With Love</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>BytebaseTech</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a
                  href="https://bytebasetech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  bytebasetech.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:adam@bytebasetech.com" className="hover:text-primary transition-colors">
                  adam@bytebasetech.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+256790490312</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Loyola Secondary School Memory Archive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
