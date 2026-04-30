# StockFlow-JonathanIslas

Una mini-plataforma para manejar inventario de productos distribuidos en varias sucursales, con movimientos entre ellas.

## 🛠️ Getting Started

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file:
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
- **Material UI + Styled Components** - Styling


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

### Branch Schema
```typescript
{
  name: string (required, unique),
  location: string (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Movement Schema
```typescript
{
  movementType: "entry" | "out" | "transfer" (required),
  productId: ObjectId (ref: Product, required),
  quantity: number (required, min: 1),
  status: "pending" | "processed" | "failed" (auto),
  originBranch: ObjectId (ref: Branch, required),
  destinationBranch: ObjectId (ref: Branch, required if transfer),
  reason: string (optional),
  createdAt: Date (auto)
}
```

### Stock Schema
```typescript
{
  productId: ObjectId (ref: Product, required),
  branchId: ObjectId (ref: Branch, required),
  quantity: number (required, min: 0),
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

#### Branches Management

**Base URL:** `/api/branches`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/branches` | Get all branches |
| **GET** | `/api/branches/[id]` | Get a specific branch |
| **POST** | `/api/branches` | Create a new branch |
| **PUT** | `/api/branches/[id]` | Update/edit a branch |
| **DELETE** | `/api/branches/[id]` | Delete a branch |

#### Movements Management

**Base URL:** `/api/movements`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/movements` | Get all movements |
| **GET** | `/api/movements/[id]` | Get a specific movement |
| **POST** | `/api/movements` | Create a new movement |
| **PUT** | `/api/movements/[id]` | Update a movement |
| **DELETE** | `/api/movements/[id]` | Delete a movement |

#### Stock Management

**Base URL:** `/api/stocks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/stocks` | Get current stock levels |


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
- ✅ Frontend UI 
- ✅ Branch/Sucursal management 
- ✅ Inventory movements 

---

## 📝 License

Private project - Jonathan Islas

