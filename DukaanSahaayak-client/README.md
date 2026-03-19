# Dukaan Sahaayak

A modern, feature-rich web application for managing sales, purchases, inventory, and credit (udhaar) for small businesses. Built with React and Tailwind CSS.

## ✨ Key Features

- **Interactive Dashboard:** Get a quick overview of your business with stats on today's sales, total transactions, and outstanding credit. Includes a 7-day profit/loss chart.
- **Inventory Management:** Easily add, view, and delete products from your inventory. Low-stock items are automatically highlighted.
- **Smart Billing:** A unified interface to create detailed bills for both sales and purchases.
- **AI-Powered Bill Scanning:** Upload an image of a bill, and the application will automatically extract the products and quantities, saving you manual entry time.
- **AI-Powered Data Chat (Shaayak):** Ask questions in natural language to query your sales, inventory, and financial data. Get instant answers, the generated SQL, and results in a clear table format.
- **Udhaar (Credit) Tracking:** Keep a clear record of sales and purchases made on credit. Easily mark them as cleared once the payment is settled.
- **PDF Generation:** Instantly generate and download professional-looking PDF invoices for sales and receipts for purchases.
- **Due Date Notifications:** Stay on top of your finances with a dedicated page for notifications about upcoming udhaar payment due dates.
- **Modern & Responsive UI:** A clean, intuitive, and fully responsive user interface built with Tailwind CSS and enhanced with smooth animations using Framer Motion.

## 🛠️ Tech Stack

- **Frontend:** [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
- **API Communication:** Axios
- **Animations:** Framer Motion
- **Charting:** Recharts
- **PDF Generation:** jsPDF & jsPDF-AutoTable
- **Icons:** Lucide React

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- A running instance of the **DukaanSahaayak server**. This frontend requires the backend API to function.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/maniksheoran/DukaanSahaayak-client
    cd DukaanSahaayak-client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    This project uses Vite and requires an environment variable to connect to the backend API.

    1. Create a `.env` file in the root directory by copying the example:
       `cp .env.example .env`
    2. Open the `.env` file and ensure `VITE_BACKEND_URL` points to your backend server. By default, it is:

    ```
    VITE_BACKEND_URL=http://localhost:8000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 📂 Folder Structure

The project is structured to keep features, pages, components, and API logic separate and organized.

```
src/
├── api/              # Functions for making API calls
├── assets/           # Static assets like images, fonts
├── components/       # Reusable UI components (e.g., Navbar, StatCard)
├── features/         # Feature-specific components (e.g., Inventory, Billing)
├── hooks/            # Custom React hooks
├── pages/            # Top-level page components
├── routes/           # Application routing setup
├── styles/           # Global styles
└── App.jsx           # Main application component
└── main.jsx          # Entry point of the application
```

- Backend Code - [DukaanSahaayak Server](https://github.com/ManikSheoran/DukaanSahaayak-server)
