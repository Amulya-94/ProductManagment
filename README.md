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

Developed for **Product Management** with a focus on simplicity and professional UI.
