# HackStore Frontend Documentation

## Overview

HackStore is a web application for buying and selling oil products. The frontend is built with React, TypeScript, and MobX for state management. This document provides an overview of the frontend architecture, key components, and functionality.

## Tech Stack

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **MobX**: State management
- **React Router**: Navigation
- **Axios**: API requests
- **CSS Modules**: Styling

## Project Structure

The project follows a feature-based architecture with the following organization:

```
src/
├── app/ # Application entry point and providers
├── features/ # Business logic and API services
├── widgets/ # Reusable UI components
├── shared/ # Shared utilities and types
├── pages/ # Pages
└── entities/ # Business entities

```

## Key Features

### Authentication

- User registration and login
- Role-based access (admin and customer)
- Protected routes

### Product Catalog

- Browse oil products
- Filter by oil type and oil pump
- Sort by various criteria
- Search functionality
- Pagination

### Shopping Cart

- Add products to cart
- Remove items
- Choose delivery method
- Checkout process

### User Profile

- View personal information
- Purchase history

### Admin Panel

- Upload CSV files with product data
- View all lots (including inactive and sold)
- Manage product listings

## Pages

### Home Page (`IndexPage`)

Landing page with featured products, testimonials, and call-to-action sections.

### Authentication Page (`AuthPage`)

Handles user login and registration with form validation.

### Lots Page (`LotsPage`)

Displays the catalog of available oil products with filtering, sorting, and pagination.

### Single Lot Page (`SingleLot`)

Shows detailed information about a specific product and allows adding it to the cart.

### Cart Page (`CartPage`)

Displays the user's shopping cart with options to remove items, and proceed to checkout.

### Personal Page (`PersonalPage`)

User profile page showing personal information and purchase history.

### Admin Page (`AdminPage`)

Admin page for managing products and uploading new data.

## State Management

The application uses MobX for state management. The main store (`store.ts`) handles:

- User authentication state
- Product catalog data
- Cart management
- Order processing
- Filtering and pagination

## UI Components

The application includes reusable UI components:

- `Button`: Customizable button with different variants and sizes
- `Grid`: Layout component for displaying items in a grid
- Various form components for user input

## API Integration

API requests are handled through Axios with service classes for different features:

- `AuthService`: Authentication operations
- `LotsService`: Product catalog operations
- `OrderService`: Order processing

## Styling

The application uses CSS Modules for component-specific styling with a consistent design system including:

- Color variables
- Typography
- Spacing
- Border radius
- Shadows

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The application will be available at `http://localhost:5173`

## Building for Production

```
npm run build
```

This will create optimized production files in the `dist` directory.
