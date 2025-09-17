# Loyola School Memories 📸

A beautiful, mobile-first photo memory management web application designed specifically for **Loyola Secondary School - Wau, South Sudan**. This platform helps preserve and organize precious school memories through an intuitive album-based system with advanced filtering and search capabilities.

## 🌟 Features

### 🏠 **Landing Page & Gallery**
- **Responsive Design**: Mobile-first approach with African-inspired warm color palette
- **Album Grid**: Beautiful masonry layout showcasing school memories
- **Smart Filtering**: Filter by category, year, month, and photo count
- **Real-time Search**: Instant search across album titles, descriptions, and metadata
- **Statistics Dashboard**: Overview of total albums, photos, and recent activity

### 📚 **Album Management**
- **Detailed Album Pages**: Individual pages for each album with full photo galleries
- **Photo Modal Viewer**: Full-screen photo viewing with navigation controls
- **Metadata Display**: Event dates, locations, photographers, and descriptions
- **Keyboard Navigation**: Arrow keys and ESC support for seamless browsing
- **Social Sharing**: Share individual photos and albums

### 🔍 **Advanced Search & Filtering**
- **Multi-criteria Filtering**: Category, year, month, and photo count ranges
- **Search Results Page**: Dedicated results with highlighted matches
- **Filter Persistence**: Maintains filter state across navigation
- **Quick Filters**: One-click category and year filtering

### 👨‍💼 **Admin Dashboard**
- **Overview Statistics**: Total albums, photos, storage usage, and recent uploads
- **Photo Upload System**: Drag-and-drop with batch upload support
- **Image Compression**: Automatic compression to 1MB maximum for optimal storage
- **Album Management**: Create, edit, and delete albums with rich metadata
- **Content Management**: Bulk operations and organization tools
- **Analytics**: Detailed insights into photo library usage

### 🗄️ **Database Integration**
- **Supabase Ready**: Complete database schema and utilities prepared
- **Type Safety**: Full TypeScript interfaces for all data models
- **Performance Optimized**: Indexed queries and efficient data structures
- **Automatic Triggers**: Photo count updates and timestamp management

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom African-inspired theme
- **UI Components**: shadcn/ui component library
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Storage**: Supabase Storage for image hosting
- **Image Processing**: Custom compression utilities with Canvas API
- **Icons**: Lucide React icons

## 🎨 Design System

### **Color Palette**
- **Primary**: Warm amber and orange gradients (`from-amber-600 to-orange-600`)
- **Neutrals**: Sophisticated grays and off-whites
- **Accents**: Complementary earth tones
- **Cultural Elements**: African-inspired warm color scheme

### **Typography**
- **Headings**: Geist Sans with multiple weights
- **Body**: Optimized for readability with proper line-height
- **Mobile-first**: Responsive typography scaling

### **Layout**
- **Mobile-first**: Designed for African mobile usage patterns
- **Flexbox Primary**: Efficient layouts with CSS Grid for complex grids
- **Responsive**: Breakpoints optimized for various screen sizes

## 📁 Project Structure

\`\`\`
loyola-memories/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   ├── album/[id]/              # Dynamic album detail pages
│   ├── globals.css              # Global styles and Tailwind config
│   ├── layout.tsx               # Root layout with fonts
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   │   ├── admin-dashboard.tsx  # Main admin interface
│   │   ├── admin-stats.tsx      # Statistics overview
│   │   ├── album-manager.tsx    # Album CRUD operations
│   │   └── photo-upload.tsx     # Upload with compression
│   ├── ui/                      # shadcn/ui components
│   ├── advanced-filters.tsx     # Advanced filtering modal
│   ├── album-detail.tsx         # Individual album view
│   ├── album-grid.tsx           # Album grid with filtering
│   ├── footer.tsx               # Site footer with credits
│   ├── header.tsx               # Navigation with search
│   ├── hero-section.tsx         # Landing page hero
│   ├── photo-modal.tsx          # Full-screen photo viewer
│   └── search-results.tsx       # Search results display
├── lib/                         # Utility libraries
│   ├── database.ts              # Database operations and types
│   ├── image-compression.ts     # Image processing utilities
│   ├── supabase.ts             # Supabase client configuration
│   └── utils.ts                # General utilities
├── public/                      # Static assets
│   └── *.jpg                   # Sample school photos
├── scripts/                     # Database scripts
│   ├── 01-create-tables.sql    # Database schema
│   └── 02-seed-data.sql        # Sample data
└── README.md                   # This file
\`\`\`

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Supabase account (for production)

### **Local Development**

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd loyola-memories
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open in browser**
   Navigate to `http://localhost:3000`

### **Production Deployment**

#### **Option 1: Deploy to Vercel (Recommended)**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add Supabase environment variables
4. Deploy automatically

#### **Option 2: Manual Deployment**
1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform
3. Configure environment variables

### **Database Setup**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Run Database Scripts**
   - Execute `scripts/01-create-tables.sql` in Supabase SQL editor
   - Execute `scripts/02-seed-data.sql` for sample data

3. **Configure Environment Variables**
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Setup Storage Bucket**
   - Create a public bucket named `photos`
   - Configure RLS policies for secure access

## 📊 Database Schema

### **Albums Table**
\`\`\`sql
- id (UUID, Primary Key)
- title (VARCHAR, Required)
- description (TEXT)
- cover_image_url (TEXT)
- category (VARCHAR, Required)
- event_date (DATE)
- location (VARCHAR)
- photographer (VARCHAR)
- photo_count (INTEGER, Auto-updated)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
\`\`\`

### **Photos Table**
\`\`\`sql
- id (UUID, Primary Key)
- album_id (UUID, Foreign Key)
- filename (VARCHAR, Required)
- original_filename (VARCHAR)
- url (TEXT, Required)
- thumbnail_url (TEXT)
- alt_text (TEXT)
- caption (TEXT)
- file_size (INTEGER)
- width (INTEGER)
- height (INTEGER)
- upload_date (TIMESTAMP)
- created_at (TIMESTAMP)
\`\`\`

## 🔧 Configuration

### **Image Compression Settings**
\`\`\`typescript
const DEFAULT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,           // Maximum 1MB file size
  maxWidthOrHeight: 1920, // Max dimension for quality
  quality: 0.8,           // 80% quality balance
}
\`\`\`

### **Supported File Types**
- JPEG/JPG
- PNG
- WebP

### **Performance Optimizations**
- Automatic image compression
- Thumbnail generation
- Lazy loading
- Optimized database queries
- CDN-ready static assets

## 🎯 Usage Guide

### **For Administrators**

1. **Access Admin Dashboard**
   - Navigate to `/admin`
   - View overview statistics and recent activity

2. **Upload Photos**
   - Fill in album information (title, category, date, etc.)
   - Drag and drop photos or click to browse
   - System automatically compresses images to 1MB
   - Click "Upload All" to save to database

3. **Manage Albums**
   - Edit album details and metadata
   - Reorganize photos within albums
   - Delete albums and photos as needed

### **For Visitors**

1. **Browse Memories**
   - Explore albums on the homepage
   - Use search to find specific events
   - Apply filters by category, year, or month

2. **View Photos**
   - Click any album to view detailed gallery
   - Use photo modal for full-screen viewing
   - Navigate with keyboard arrows or touch gestures

## 🌍 About Loyola Secondary School

**Loyola Secondary School - Wau** is located in South Sudan and serves as an important educational institution in the region. This photo memory application helps preserve the rich history and memorable moments of the school community.

**School Website**: [https://lss.esomero.bytebasetech.com/about](https://lss.esomero.bytebasetech.com/about)

## 🤝 Contributing

We welcome contributions to improve the Loyola School Memories platform:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain mobile-first responsive design
- Write meaningful commit messages
- Test on multiple devices and browsers
- Ensure accessibility compliance

## 📝 License

This project is developed specifically for Loyola Secondary School - Wau, South Sudan. All rights reserved.

## 🏆 Credits

**Designed and Developed with ❤️ by BytebaseTech**

- **Website**: [https://bytebasetech.com](https://bytebasetech.com)
- **Email**: adam@bytebasetech.com
- **Phone**: +256790490312

---

### 🙏 Acknowledgments

- Loyola Secondary School administration and staff
- Students and families who contribute their precious memories
- The South Sudanese community for their support
- Open source contributors and the Next.js community

---

**Preserving memories, building futures. 🌟**

*This application serves as a digital archive of the beautiful moments and achievements at Loyola Secondary School, ensuring that these precious memories are preserved for current and future generations.*
