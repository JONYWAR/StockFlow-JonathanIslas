# StockFlow-JonathanIslas

Una mini-plataforma para manejar inventario de productos distribuidos en varias sucursales, con movimientos entre ellas.

## 🛠️ Getting Started

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env.local` file:
```
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Development
```bash
npm run dev
```

### Build & Deploy
```bash
npm run build
```


## 📋 **Tech Stack** <br />

---

### **Frontend**

- **Next.js** 16.2.4 - React framework
- **React** 19.2.4 - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** 4 - Styling


### **Backend**

- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - Runtime environment


### **Database & Schema**

- **MongoDB Atlas** - Cloud database (Free Tier)
- **Mongoose** 9.6.0 - ODM for MongoDB


### **Validation**

- **Zod** 4.3.6 - Runtime schema validation


### **DevOps & Deployment**

- **Vercel** - Hosting & CI/CD platform
- **GitHub** - Version control


### **Development Tools**
- **ESLint** 9 - Code linting
- **PostCSS** 4 - CSS processing




## 🏗️ Architecture Overview

---


```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │ (push)
         ▼
┌─────────────────┐
│     Vercel      │ ◄─── Auto Deploy
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  StockFlow App (Next.js)        │
│  ├── Frontend (React)           │
│  └── Backend (API Routes)       │
└────────┬────────────────────────┘
         │ (API calls)
         ▼
┌─────────────────────────────────┐
│  MongoDB Atlas                  │
│  (Cloud Database - Free Tier)   │
└─────────────────────────────────┘
```



## 🚀 Current Features

---

## 📊 Data Model

### Product Schema
```typescript
{
  sku: string (required, unique),
  name: string (required),
  price: number (required, positive),
  category: string (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

All data is validated using **Zod** schema validation before being persisted to the database.

### API Endpoints

#### Products Management

**Base URL:** `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/products` | Get all products |
| **GET** | `/api/products/[id]` | Get a specific product |
| **POST** | `/api/products` | Create a new product |
| **PUT** | `/api/products/[id]` | Update/edit a product |
| **DELETE** | `/api/products/[id]` | Delete a product |


---

## 🔄 Workflow & Pipeline

### Deployment Flow

1. **Development** → Code changes committed to feature branch
2. **Push to GitHub** → `git push origin main`
3. **Vercel Auto-Deploy** → Webhook triggered automatically
4. **Build & Test** → Vercel builds and deploys the application
5. **Live on Production** → App available at deployed URL
6. **Database Connection** → App communicates with MongoDB Atlas
7. **Ready for Use** → API endpoints accessible in production

---

## ✅ Current Status

- ✅ MongoDB Atlas connected
- ✅ Product model created with Mongoose
- ✅ Zod validation schema implemented
- ✅ CRUD API endpoints implemented
- ✅ Error handling & validation
- ✅ Deployed to Vercel with auto-deployment
- ⏳ Frontend UI (in progress)
- ⏳ Branch/Sucursal management (planned)
- ⏳ Inventory movements (planned)

---

## 📝 License

Private project - Jonathan Islas

