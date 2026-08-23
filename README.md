# 💰 Mero Basket

> **Turn raw business data into decisions.**

Mero Basket is an AI-powered **finance and business management platform** that transforms scattered company data into a single, intelligent command center.

Upload or connect raw data such as **sales, expenses, transactions, inventory, and market data** — Mero Basket automatically organizes it, calculates key financial metrics, detects anomalies, forecasts trends, and tells businesses what they should pay attention to next.

Instead of drowning in spreadsheets and disconnected systems, businesses get a clear picture of their **financial and operational health** in one place.

---

## 🚀 The Problem

Businesses generate huge amounts of data every day:

* Sales transactions
* Operating expenses
* Inventory movements
* Supplier purchases
* Cash flow
* Market data
* Product performance

But this data is often scattered across spreadsheets, databases, invoices, and different software.

This creates a major problem:

> **Businesses have the data, but don't always have the insight.**

Manually organizing data and calculating metrics takes time, while unusual patterns and upcoming problems can easily go unnoticed.

---

## 💡 Our Solution

Mero Basket creates an intelligent layer on top of business data.

### Raw Data → Mero Basket → Actionable Decisions

The platform:

1. **Ingests** raw business data
2. **Cleans and organizes** it automatically
3. **Centralizes** everything into one dashboard
4. **Calculates** important financial metrics
5. **Tracks** inventory and operational performance
6. **Analyzes** market trends
7. **Uses AI** to detect anomalies and forecast future outcomes
8. **Generates actionable recommendations**

---

# ✨ Key Features

## 📊 Financial Dashboard

Get an instant overview of the company's financial health.

Track:

* Total Revenue
* Total Expenses
* Net Profit
* Profit Margin
* Cash Flow
* Accounts / Transactions
* Revenue Growth
* Expense Growth

Interactive charts allow users to filter data by:

* Date
* Product
* Category
* Department
* Transaction type
* Region
* Custom ranges

---

## 📦 Smart Inventory Management

Never get surprised by an empty warehouse.

Mero Basket monitors:

* Current stock
* Stock movement
* Sales velocity
* Low-stock products
* Overstocked products
* Reorder requirements
* Inventory value

### AI-powered reorder insights

Instead of simply saying:

> "Product X is low."

Mero Basket can provide context such as:

> **Product X may run out within 8 days based on its current sales velocity. Consider reordering approximately 120 units.**

---

## 🤖 AI Business Intelligence

Mero Basket doesn't just visualize data — it **interprets it**.

The AI analyzes business activity to identify:

### 🔎 Anomalies

Detect unusual behavior such as:

* Unexpected expense spikes
* Sudden revenue drops
* Abnormally large transactions
* Unusual inventory movement
* Unexpected changes in product performance

### 📈 Forecasting

Estimate future business trends using historical data.

Examples:

* Expected revenue next month
* Predicted inventory demand
* Expected expenses
* Cash-flow projections
* Product demand trends

### 💡 Recommendations

Convert analysis into actions.

For example:

> ⚠️ **Operating expenses increased 23% this month**, primarily due to shipping costs.

> 📦 **Product A is selling 34% faster than last month.** Inventory may need replenishment soon.

> 📈 **Revenue has increased consistently for the last 4 weeks.**

---

# 🧠 Ask Your Business

Mero Basket can include an AI business assistant that allows users to ask questions about their data in natural language.

Instead of manually searching through spreadsheets:

**"What were our most profitable products this quarter?"**

**"Why did expenses increase this month?"**

**"Which products are likely to run out of stock?"**

**"How much revenue did we generate last month?"**

The AI analyzes the available business data and provides an understandable answer.

---

# 📉 Market Intelligence

Mero Basket can combine internal company data with external market information to provide additional context.

Track:

* Market performance
* Relevant market trends
* Product demand
* Industry indicators
* Market movements

This helps businesses understand not only **what is happening internally**, but also **what might be influencing it externally**.

---

# 🏗️ System Architecture

```text
                  ┌─────────────────────┐
                  │     Raw Data        │
                  │                     │
                  │ Sales               │
                  │ Expenses            │
                  │ Transactions        │
                  │ Inventory           │
                  │ Market Data         │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Data Processing   │
                  │                     │
                  │ Cleaning            │
                  │ Validation          │
                  │ Normalization       │
                  │ Categorization      │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │     Data Layer      │
                  │                     │
                  │ Database            │
                  │ Analytics           │
                  │ Aggregations        │
                  └──────────┬──────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │   Analytics     │       │    AI Engine    │
       │                 │       │                 │
       │ Metrics         │       │ Anomaly Detect. │
       │ Trends          │       │ Forecasting     │
       │ Inventory       │       │ Recommendations │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                └────────────┬────────────┘
                             ▼
                  ┌─────────────────────┐
                  │ Mero Basket Web App │
                  │                     │
                  │ Dashboard           │
                  │ Charts              │
                  │ Inventory           │
                  │ Insights            │
                  │ AI Assistant        │
                  └─────────────────────┘
```

---

# 🛠️ Tech Stack

Mero Basket is built as a **full-stack Next.js application**, combining a modern frontend, backend API routes, database management, authentication, data visualization, email functionality, and spreadsheet processing.

### Frontend

* **Next.js** — Full-stack React framework
* **React** — User interface and component architecture
* **TypeScript** — Type-safe development
* **Tailwind CSS** — Responsive and modern UI styling
* **Recharts** — Interactive financial dashboards and data visualizations
* **Lucide React** — Consistent icon system

### Backend & Database

* **Next.js API Routes** — Server-side APIs and backend logic
* **Prisma** — Database ORM and schema management
* **SQLite** — Lightweight relational database
* **Supabase CLI** — Database and development tooling

### Authentication & Communication

* **NextAuth.js** — Secure user authentication and session management
* **Nodemailer** — Email notifications and communication

### Data Processing

* **XLSX** — Excel/spreadsheet import and export
* **Prisma** — Structured database access and data management

### Development & Code Quality

* **ESLint** — Code quality, consistency, and linting

### ⚡ Architecture

```text
                    ┌─────────────────────┐
                    │     Next.js App     │
                    │                     │
                    │ React + TypeScript  │
                    │ Tailwind CSS        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    API Routes       │
                    │                     │
                    │ Business Logic      │
                    │ Data Processing     │
                    │ Financial Metrics   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │       Prisma        │
                    │    ORM / Models     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │       SQLite        │
                    │      Database       │
                    └─────────────────────┘

     ┌──────────────┐     ┌──────────────┐
     │   NextAuth   │     │   Nodemailer │
     │ Authentication│     │    Email     │
     └──────────────┘     └──────────────┘

     ┌──────────────┐     ┌──────────────┐
     │    XLSX      │     │   Recharts   │
     │ Excel I/O    │     │  Analytics   │
     └──────────────┘     └──────────────┘
```

### 📦 Core Technologies

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| Next.js      | Full-stack application framework |
| React        | UI and component development     |
| TypeScript   | Type safety                      |
| Tailwind CSS | Styling and responsive design    |
| Prisma       | Database ORM                     |
| SQLite       | Application database             |
| Supabase CLI | Database/development tooling     |
| NextAuth     | Authentication                   |
| Recharts     | Charts and data visualization    |
| Lucide React | UI icons                         |
| Nodemailer   | Email functionality              |
| XLSX         | Spreadsheet import/export        |
| ESLint       | Code quality and linting         |

---

# 🔄 Data Pipeline

```text
CSV / Excel / API
       ↓
Data Ingestion
       ↓
Validation
       ↓
Cleaning & Normalization
       ↓
Database
       ↓
Financial Calculations
       ↓
Analytics Engine
       ↓
AI Analysis
       ↓
Dashboard + Recommendations
```

---

# 📐 Core Financial Metrics

Mero Basket automatically calculates metrics including:

### Revenue

```text
Revenue = Σ Sales
```

### Gross Profit

```text
Gross Profit = Revenue - Cost of Goods Sold
```

### Net Profit

```text
Net Profit = Revenue - Total Expenses
```

### Profit Margin

```text
Profit Margin = (Net Profit / Revenue) × 100
```

### Inventory Value

```text
Inventory Value = Σ (Quantity × Unit Cost)
```

Additional metrics can be calculated depending on the available dataset.

---

# 🎯 Target Users

Mero Basket is designed for:

* Small businesses
* Startups
* Retail companies
* E-commerce businesses
* Finance teams
* Operations teams
* Business owners
* Management teams

---

# 🔥 Why Mero Basket?

Traditional business dashboards answer:

> **"What happened?"**

Mero Basket aims to answer:

> **"What happened, why did it happen, what might happen next, and what should we do about it?"**

That's the difference between a **dashboard** and a **decision-support system**.

---

# 🧪 Example

Imagine a company has uploaded 50,000 transaction records.

Mero Basket automatically discovers:

```text
Revenue                    $482,300
Expenses                   $351,200
Net Profit                 $131,100
Profit Margin                  27.2%

Inventory Value            $214,500
Low Stock Products                8
Potential Stockouts              3
```

The AI then identifies:

> 🚨 **Shipping expenses increased 31% compared to the previous month.**

> 📦 **3 products may reach critical inventory levels within 10 days.**

> 📈 **Product A's sales increased 42% over the last month.**

> 💰 **Projected revenue for next month: ~$515K.**

The business owner can go from **raw data → understanding → action** within seconds.

---

# 🏆 Hackathon Vision

Mero Basket isn't trying to replace every enterprise system.

The goal is to demonstrate how **AI can sit on top of ordinary business data and turn it into something genuinely useful.**

A company shouldn't need a team of analysts to answer:

> *"How are we doing?"*

Mero Basket should be able to answer that instantly.

---

# 🚧 Future Improvements

* Bank integrations
* Automated invoice processing
* OCR for receipts and invoices
* Advanced demand forecasting
* Multi-company support
* Role-based access control
* Automated financial reports
* PDF report generation
* Supplier management
* Automated purchase orders
* More advanced market intelligence
* AI-generated business strategy reports

---

# 👥 Team

Built with ❤️ during **BNKS National Hackathon 2026**.

### Contributors

* **Anuj Adhikari**
* **Prasang Dahal**
* **Sofan Paudel**
* **Dikshant Shrestha**

---

# 📄 License

This project was created for educational and hackathon purposes.

---

<div align="center">

### Mero Basket

**From raw business data to smarter decisions.**

</div>
