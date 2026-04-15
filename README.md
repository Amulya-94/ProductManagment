# Product Admin Application

A full-stack project for managing a product catalog with JWT-based authentication and Role-Based Access Control (RBAC).

## 🚀 Features
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) access for products, including image URL support.
- **Product Catalog (User)**: Read-only access to the product list.
- **JWT Security**: Stateless authentication with role-based endpoint protection.
- **H2 Database**: Persistent file-based storage with automatic data seeding.
- **UI Refinement**: Responsive, centered layout with a clear visual hierarchy.

## 🛠️ Tech Stack
- **Backend**: Spring Boot 3.3.5 (Java 17), Maven, JPA/Hibernate.
- **Frontend**: React 18, Vite, Vanilla CSS.
- **Database**: H2 (File-based).

## 🏁 Getting Started

### 1. Prerequisites
- **Java 17** or higher.
- **Node.js** (LTS version).

### 2. Run the Backend
```bash
cd product-admin
.\mvnw.cmd spring-boot:run
```
The server starts at `http://localhost:8080`.

### 3. Run the Frontend
```bash
cd product-admin/product-admin-ui
npm install  # (First time only)
npm run dev
```
The frontend starts at `http://localhost:5173`.

## 🔐 Credentials
| Role | Username | Password |
| :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` |
| **USER** | `user` | `user123` |

## 🗄️ H2 Database Console
The in-browser database manager is enabled for development:
- **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:file:./data/productdb`
- **User**: `sa` | **Password**: (leave blank)

---

## 🚀 Deploy to Render

You can host both the Backend and Frontend for free on [Render](https://render.com).

### 1. Backend (Web Service)
1. In Render, create a new **Web Service** and connect this repository.
2. Set the **Root Directory** to `.` (the root).
3. Set the **Environment** to `Docker` (it will automatically use the `Dockerfile`).
4. Add the following **Environment Variables**:
   - `JWT_SECRET`: Generate a random long string (e.g., `your_secure_random_key`), otherwise it uses the fallback.
   - `ALLOWED_ORIGINS`: Set this to your frontend URL later (e.g., `https://your-frontend.onrender.com`).

### 2. Frontend (Static Site)
1. In Render, create a new **Static Site** and connect the same repository.
2. Set the **Root Directory** to `product-admin-ui`.
3. Set the **Build Command** to `npm install && npm run build`.
4. Set the **Publish Directory** to `dist`.
5. Add the following **Environment Variable**:
   - `VITE_API_URL`: Set this to your backend's Render URL (e.g., `https://your-backend.onrender.com`).

*Note: On Render's free tier, the H2 file database is ephemeral and resets on each deploy/restart.*

---

Developed for **Product Management** with a focus on simplicity and professional UI.
