# Virtual Art Gallery Application

A comprehensive platform for displaying and managing artworks in a virtual gallery environment.

## Features

### User Roles

#### 🎨 **Artist**
- Upload and manage artwork listings
- Track sales and revenue
- View artwork statistics
- Manage portfolio

#### 👥 **Visitor**
- Browse artwork collection
- View detailed artwork information including cultural history
- Add artworks to cart for purchase
- Participate in virtual tours

#### 🏛️ **Curator**
- Organize exhibitions
- Provide insights on artworks
- Manage gallery content
- Create themed collections

#### ⚙️ **Admin**
- Manage platform content
- Control user roles and permissions
- Configure gallery settings
- Monitor platform statistics

### Key Features

#### 🖼️ **Gallery Display**
- Grid-based artwork showcase
- Detailed artwork information modals
- Cultural and historical context for each piece
- Shopping cart functionality

#### 🚶 **Virtual Tours**
- **Guided Tours**: Automatic progression through artworks
- **Self-Paced Tours**: Manual navigation control
- Audio guide transcripts
- Historical and cultural commentary

#### 📊 **Management Dashboards**
- Role-specific interfaces
- Real-time statistics
- Content management tools
- User administration

## Usage

### Getting Started
1. The application starts with Visitor role by default
2. Use the role selector buttons in the header to switch between roles
3. Navigate between Gallery and Virtual Tour using the navigation buttons

### Role Switching
- **Visitor**: Browse and purchase artworks
- **Artist**: Upload new artworks and track sales
- **Curator**: Create exhibitions and add insights
- **Admin**: Manage users and platform settings

### Virtual Tours
1. Click "Virtual Tour" in the navigation
2. Choose between Guided or Self-Paced tour modes
3. Use controls to navigate through the collection
4. Read cultural history and audio guide information

## Technical Implementation

### Components Structure
- `App.js`: Main application with routing and state management
- `Header.js`: Navigation and role switching
- `Gallery.js`: Artwork display and shopping functionality
- `AdminPanel.js`: Platform administration
- `ArtistDashboard.js`: Artist portfolio management
- `CuratorPanel.js`: Exhibition and content curation
- `VirtualTour.js`: Interactive tour experience

### Features Implemented
- ✅ Multi-role user system
- ✅ Artwork management (CRUD operations)
- ✅ Virtual tour with guided/self-paced modes
- ✅ Cultural history information
- ✅ Shopping cart functionality
- ✅ Exhibition management
- ✅ User administration
- ✅ Real-time statistics
- ✅ Responsive design

## Sample Data
The application includes sample artworks:
- Starry Night by Vincent van Gogh
- Mona Lisa by Leonardo da Vinci

Each artwork includes:
- Title, artist, and year
- Description and cultural history
- Category and pricing
- Virtual display capabilities

## Future Enhancements
- Image upload functionality
- Payment processing integration
- User authentication system
- Advanced search and filtering
- Social features and reviews
- Mobile app version