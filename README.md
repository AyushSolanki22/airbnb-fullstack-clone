# 🏠 Airbnb Full-Stack Clone

A full-stack **Airbnb-inspired accommodation booking platform** built to understand and implement real-world web application concepts such as authentication, authorization, property management, bookings, sessions, file uploads, MongoDB relationships and dynamic pricing.

> **Disclaimer:** This is an independent educational project inspired by Airbnb. It is not affiliated with, sponsored by, or endorsed by Airbnb.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- Secure password hashing using **bcrypt**
- Session-based authentication
- Persistent login sessions using MongoDB session storage
- Logout functionality
- Guest and Host account types
- Strong password validation
- Email validation
- Confirm-password validation
- Terms & conditions acceptance
- Protected routes for authenticated users
- Host-only protected routes
- Authorization checks to ensure hosts can only manage their own properties

---

### 🏡 Property Management

Hosts can:

- Register a new property
- Add property name and location
- Set nightly pricing
- Set maximum guest capacity
- Configure extra guest charges
- Add property ratings
- Add property descriptions
- Upload property images
- Upload house-rules PDF documents
- View their listed properties
- Edit existing properties
- Replace property images
- Replace house-rules documents
- Delete properties

The application also cleans up replaced/deleted uploaded files to prevent unnecessary files from remaining on the server.

---

### 📸 File Upload System

Implemented using **Multer**.

Supported property images:

- JPG
- JPEG
- PNG
- WEBP

Supported house rules:

- PDF

The upload system validates both MIME type and file extension before accepting files.

Uploaded files are stored on the server and served through the `/uploads` route.

---

### ❤️ Favourites

Users can:

- Add properties to favourites
- View their favourite properties
- Remove properties from favourites

Favourites are stored as MongoDB references to property documents and populated when required.

---

### 📅 Booking System

Authenticated users can book available properties.

The booking system includes:

- Check-in date
- Check-out date
- Number of guests
- Number of nights
- Base nightly price
- Extra guest fee
- Extra guest count
- Base booking amount
- Extra guest amount
- Final booking price
- Booking status

The system also prevents:

- Booking a property in the past
- Invalid check-in/check-out dates
- Check-out before check-in
- Exceeding the property's guest capacity
- Hosts booking their own properties
- Double booking for overlapping dates

---

### 💰 Dynamic Pricing

The booking price is calculated automatically.

#### Base amount

```text
Base Price × Number of Nights
```

#### Extra guest amount

```text
Extra Guests × Extra Guest Fee × Number of Nights
```

#### Final price

```text 
Base Amount + Extra Guest Amount
```

This makes the booking system more realistic than a simple static-price implementation.

---

### ❌ Booking Cancellation

Users can:

- View their bookings
- See booking details
- Cancel confirmed bookings

Cancelled bookings are retained with a `cancelled` status instead of being immediately removed from the database.

---

### 🛡️ Security & Validation

The backend implements multiple validation and authorization checks.

Examples include:

- Password strength validation
- Email validation
- User-type validation
- Authentication middleware
- Host ownership validation
- Booking ownership validation
- Maximum guest validation
- Date validation
- Booking conflict detection
- File-type validation
- File-extension validation
- Error-handling middleware

---

## 🧰 Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Express Session**
- **connect-mongodb-session**
- **bcryptjs**
- **express-validator**
- **Multer**

### Frontend

- **EJS**
- **HTML5**
- **CSS3**
- **Tailwind CSS**
- Responsive design

### Database

**MongoDB Atlas**

Main relationships include:

```text
User
 ├── Favourites → Home
 ├── Bookings → Home
 └── Hosted Homes → Home

Home
 └── Host → User

Booking
 ├── User → User
 └── Home → Home
```

---

## 🏗️ Architecture

The application follows a modular Express architecture.

```text
airbnb-fullstack-clone/
│
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── hostController.js
│   ├── storeController.js
│   └── error.js
│
├── models/
│   ├── user.js
│   ├── home.js
│   └── booking.js
│
├── routes/
│   ├── auth.js
│   ├── booking.js
│   ├── host.js
│   └── store.js
│
├── views/
│   ├── auth/
│   ├── host/
│   ├── store/
│   └── partials/
│
├── public/
│   ├── css/
│   └── ...
│
├── uploads/
│
├── utils/
│   └── ...
│
├── app.js
├── package.json
├── .env
└── .gitignore
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

SESSION_SECRET=your_random_session_secret
```

### Example

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airbnb
SESSION_SECRET=replace_with_a_long_random_secret
```

> Never commit your `.env` file to GitHub.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/airbnb-fullstack-clone.git
```

### 2. Navigate into the project

```bash
cd airbnb-fullstack-clone
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env`

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

### 5. Start the application

For development:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

---

## 👤 User Roles

### Guest

Guests can:

- Create an account
- Log in
- Browse properties
- View property details
- Add properties to favourites
- Book properties
- View bookings
- Cancel bookings

### Host

Hosts can:

- Create an account as a host
- Add properties
- Upload property images
- Upload house rules
- Edit properties
- Replace uploaded files
- Delete properties
- View their listed properties

---

## 📊 Booking Flow

```text
User
 │
 ▼
Select Property
 │
 ▼
Choose Check-in / Check-out
 │
 ▼
Select Number of Guests
 │
 ▼
Validate Dates & Guest Limit
 │
 ▼
Check Booking Conflicts
 │
 ▼
Calculate Price
 │
 ▼
Create Booking
 │
 ▼
My Bookings
```

---

## 🗄️ Data Models

### User

Stores:

- First name
- Last name
- Email
- Hashed password
- User type
- Favourite properties

### Home

Stores:

- Property name
- Price
- Maximum guests
- Extra guest fee
- Location
- Rating
- Photo
- Description
- House rules
- Host reference

### Booking

Stores:

- Property reference
- User reference
- Check-in date
- Check-out date
- Number of guests
- Number of nights
- Base price
- Extra guest fee
- Extra guest count
- Base amount
- Extra guest amount
- Total price
- Booking status

---

## 🧠 What I Learned

This project helped me understand and implement:

- Express.js application architecture
- MVC-style separation
- RESTful routing concepts
- MongoDB database design
- Mongoose schemas and references
- MongoDB `populate()`
- Authentication
- Authorization
- Session management
- Persistent sessions with MongoDB
- Password hashing
- Form validation
- File uploads
- File management
- CRUD operations
- Booking systems
- Date calculations
- Overlapping-date detection
- Dynamic pricing
- Error handling
- Middleware
- Server-side rendering with EJS
- Responsive UI development
- Tailwind CSS

---

## 🔮 Future Improvements

Possible future improvements include:

- ⭐ User reviews and ratings
- 🔎 Advanced property search
- 📍 Location-based search
- 🗺️ Interactive maps
- 💳 Online payment integration
- 📧 Booking confirmation emails
- 🔔 Notifications
- 📅 Host booking calendar
- 🖼️ Multiple property images
- ☁️ Cloud image storage
- 👤 Profile management
- 🔐 Password reset
- 📱 Improved mobile experience
- ⚡ REST API layer
- ⚛️ React frontend
- 🐳 Docker support
- 🚀 Production deployment

---

## 📸 Screenshots

Add screenshots of the major parts of the application here.

Recommended screenshots:

1. Home page
2. Property listing
3. Property details
4. Login
5. Signup
6. Host dashboard
7. Add property page
8. Booking page
9. My bookings
10. Favourites

Example:

screenshots/
├── home.png
├── homes-list.png
├── property-details1.png
├── property-details2.png
├── property-details3.png
├── login.png
├── signup1.png
├── signup2.png
├── host-dashboard.png
├── add-property1.png
├── add-property2.png
├── add-property3.png
├── booking1.png
├── booking2.png
├── bookings.png
├── bookings2.png
└── favourites.png
```

---

## 👨‍💻 Author

**Ayush**

B.Tech Student | Full-Stack Developer | AI & Technology Enthusiast

---

## ⭐ Project Status

🚧 **Active Development**

This project is continuously being improved with new features, security improvements and better production architecture.

---

## 📄 License

This project is intended for educational and portfolio purposes.
