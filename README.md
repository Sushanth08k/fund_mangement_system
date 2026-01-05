# Fund Management System

A web-based platform for transparent, efficient, and accountable allocation and tracking of institutional or governmental funds. The system supports real-time monitoring, role-based dashboards, and comprehensive analytics for both administrators and regular users.

## Features

- **Secure Authentication**: User registration and login with Firebase Authentication
- **Role-Based Access**: Admins and Users have separate dashboards and features
- **Fund Allocation Workflow**: Admins can approve, reject, and monitor fund requests; users can submit and track their requests
- **Real-Time Dashboard**: Instant updates for transactions, fund status, and analytics
- **Comprehensive Analytics**: Visual reports and charts for allocations, utilizations, and trends
- **Audit Trails**: All actions are logged for transparency and accountability
- **Responsive Design**: Fully functional on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, Chart.js, CSS3, HTML5
- **Backend/Cloud**: Firebase Authentication, Firestore Database, Firebase Hosting
- **Other Tools**: React Router, Context API, Git, VS Code, npm

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase account (for backend setup)
- Git (for version control)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/fund-management-system.git
   cd fund-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Add your web app and copy the Firebase config
   - Create a `.env` file in the project root and add your Firebase credentials:
   ```bash
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
   - If you do not use Firebase Analytics, `REACT_APP_FIREBASE_MEASUREMENT_ID` is optional.


4. **Start the development server:**
   ```bash
   npm start
   ```

5. **(Optional) Deploy to Firebase Hosting:**
   ```bash
   npm run build
   firebase login
   firebase init
   firebase deploy
   ```

## Usage

- **Admin Login**: Manage users, approve/reject fund requests, and view analytics
- **User Login**: Submit new fund requests, track their status, and view your allocation history
- **Real-Time Updates**: All dashboards and analytics update instantly as data changes

## Folder Structure

```
fund-management-system/
├── public/
├── src/
│   ├── components/
│   ├── services/
│   ├── contexts/
│   ├── styles/
│   ├── App.js
│   └── ...
├── .env
├── package.json
└── README.md
```

## Security

- Role-based access enforced throughout the app
- Firestore security rules restrict unauthorized data access
- All data transmitted over HTTPS

## Contributing

Contributions are welcome! Please fork the repository, create a new branch for your feature or bugfix, and submit a pull request.

## License

This project is licensed under the MIT License.

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
