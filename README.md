# React Application Readme

## Overview

This React application is designed for managing user data and credentials, providing authentication features, and displaying relevant information to the correct users. It includes multiple components for user authentication, data display, and a home page.

## Components

### 1. `App`

The `App` component serves as the main entry point for the application. It includes routing using React Router and manages the global state, such as user authentication details. This component initializes state, handles user login/logout, and renders other components based on the current route.

### 2. `HomePage`

The `HomePage` component serves as the layout of the website displaying individual components on the page using a conditional in the sidebar. The component also serves as the main component for data retrieval for the logged in user.

### 3. `AuthPanel`

The `AuthPanel` component handles user authentication, allowing users to log in or register. It toggles between login and registration forms, making HTTP requests to the backend for authentication and registration.

### 4. `DataDisplay`

The `DataDisplay` component is responsible for displaying and managing user data aswell as grouping data based on divisions. It allows users with appropriate permissions to edit existing data and add new credentials utilizing forms for user interaction.

### 5. `UserDisplayPage`

The `UserDisplayPage` component focuses on displaying user information, including roles and department-wise grouping. Users with admin or manager privileges can edit user roles.

### 6. `AssignDesign`

The `AssignDesign` component is embedded within `UserDisplayPage` to manage the assignment of users to specific departments and divisions. Users can be assigned or unassigned with corresponding form controls.



## Setup

### Initializing application

1. Clone the repository:
2. Navigate to the backend and run `npm install`.
3. Navigate to the frontend and run `npm install`.

### Running application
Once all dependencies are installed:

1. Navigate to the backend and run `npm start`.
2. Navigate to the frontend and run `npm start`.



## Navigating application
1. Once inside the application, click on `Sign In` to log in with an existing user or register a new user.
2. After returning to the home page, users will see all the information they can access, and they can add or edit information.