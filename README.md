# Project X — Enterprise Dashboard Application

Enterprise company onboarding, legal verification, multi-stage approval, public listing governance, and company owner management dashboard for **Project X**.

## 🚀 Technology Stack
- **React 18** + **Vite 6** + **TypeScript**
- **Tailwind CSS** + Custom Luxury Dark Tokens (`#0b0f19` canvas, `#0f172a` cards, `#ea580c` accents)
- **Lucide React** Icons
- **React Router v6** with Strict Role-Based Guards

## 🔑 Roles & Demo Credentials
- **Admin**: `admin@projectx.io` (Full Platform Review, Verification Decisions, Audit Logs, Master Data, CMS, Governance)
- **Company Owner**: `sarah.vance@novasystems.io` (Company Management, Profile/Listing Preview, Discovery, Historical Timeline)
- *Quick Login demo buttons are provided on the Login screen and in the top header for instant role switching.*

## 📁 Architecture
Adheres strictly to the modular architectural layout:
- `src/app/`: Providers, Route configuration, Guards, App entry
- `src/layouts/`: DashboardLayout (Responsive Sidebar + Header), AuthLayout, AdminLayout, CompanyOwnerLayout
- `src/modules/admin/`: 13 administrative modules including Onboarding Review, Companies, Listings, Central Documents, Reports, Audit Logs, Master Data, CMS, Settings
- `src/modules/company-owner/`: 9 owner modules including Overview, My Company Profile/Edit, My Listing Previews, Discover Directory, Onboarding Timeline, Analytics, Documents
- `src/shared/`: Reusable UI primitives, Form components, Feedback states, Custom hooks, Storage & API services, Types, and Constants

## 🛠️ Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
