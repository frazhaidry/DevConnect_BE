#Project Overview: Social Connection Platform

This project is a minimalistic social connection platform designed to enable users to discover and build meaningful connections. The platform prioritizes user security, clean interaction flows, and efficient management of connection requests. Built with Node.js, Express, and MongoDB, it ensures secure and scalable backend operations.

#Key Features:

##1. Authentication
User Sign-Up/Login: Secure registration and login using email and password.
Password Hashing: User passwords are hashed using bcrypt for enhanced security.
JWT Authentication: JSON Web Tokens are used for session management and stored in cookies.

##2. Middleware for Security
Route Protection: Middleware ensures only authenticated users can access protected routes.
Request Validation: Validates incoming data to ensure compliance with security and logical constraints.

##3. User Profile Management
Profile Editing: Users can update their personal information, such as name, bio, and profile picture.
Password Updates: Allows users to securely change their password, with hashing applied before saving.

##4. Connection System
Send Connection Requests: Users can send connection requests to others with defined statuses: interested or ignored.
Request Review: Recipients can accept or reject connection requests.
Validation: Prevents duplicate requests or self-directed requests.

##5. Feed
Dynamic User Feed: Displays a curated list of profiles that users are not connected with. Excludes:
Users who have ignored or rejected requests.
Already connected users or those with pending requests.
Pagination: Efficiently handles large datasets by paginating the feed.

##6. Database Design
MongoDB:
User schema stores personal details and connection statuses.
Connection request schema tracks sender (fromUserId), recipient (toUserId), and statuses (e.g., pending, accepted).
Logical constraints ensure no duplicate or self-referencing requests.
