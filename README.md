# Real Estate Plateform
## Description

This project is a comprehensive real estate platform that serves multiple user roles, including buyers, sellers, and administrators. The application offers a diverse range of functionalities tailored to each user type. Buyers can browse and manage their favorite property listings, while sellers have the capability to create, edit, and delete their property listings. Administrators wield control over user management and all listings on the platform. The system integrates OAuth for secure authentication, with additional features like role selection and dynamic content rendering based on user type. Robust backend APIs support these functionalities, ensuring efficient data handling and user experience.

## Features

- **User Authentication:** Secure login and signup processes, including Google OAuth integration.
- **Role-Based Access Control:** Distinct functionalities for buyers, sellers, and administrators.
- **Property Listings Management:**
  - Buyers: Browse listings, manage favorites.
  - Sellers: Create, edit, and delete their own listings.
  - Admins: Oversee all users and listings, with the ability to edit or remove them.
- **Dynamic Content Rendering:** User interfaces and experiences change based on the user's role.
- **Responsive Design:** The application is fully responsive, ensuring a seamless experience across various devices.

## Technologies Used

- **Frontend:** **React**, **Redux** for state management, **Tailwind CSS** for styling.
- **Backend:** **Node.js** with **Express**, **MongoDB** for data storage, **Mongoose** for database schema management.
- **Authentication:** **JWT** (JSON Web Tokens) for secure API access, **Google OAuth** for social login.
- **Additional Libraries and Tools:**
  - **Redux Persist** for state persistence across sessions.
  - **Firebase** for OAuth functionalities.
  - **Ant Design** for admin panel UI components.


## Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/jack0712li/Real-estate-app.git
   
2.**Install Dependencies:**
- Navigate to the project directory and install backend dependencies:
  ```bash
  npm install
  
- Navigate to the frontend directory and install frontend dependencies:
  ```bash
  cd client
  npm install
  
3.**Environment Variables:**
- Set up your `.env` file in the root directory with the following variables:
  ```bash
  MONGO=[Your MongoDB URI]
  SECRET_KEY=[Your JWT Secret Key]

4.**Environment Variables:**
- Start the backend server:
  ```bash
  npm run dev
- In a new terminal, start the frontend:
  cd client
  npm start
  
## Usage
- As a new user, sign up and choose your role (buyer, seller, or admin).
- Login with your credentials or use Google OAuth for quick access.
- Based on your role, explore the functionalities available to you on the platform.

## Contributing
Contributions to this project are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a pull request.



