# Connecting React (Vite) Frontend → PHP Backend → MySQL — Full Developer Guide

This comprehensive guide combines your **actual project folder structure** with a step-by-step tutorial on connecting your React (Vite) frontend to a PHP backend that communicates with a MySQL database — and implementing full CRUD operations (Create, Read, Update, Delete).

---

## 📁 Project Folder Overview (Your Structure)
```
REACT_INVENTORY_SYSTEM/
├─ backend/
│  ├─ api/
│  │  ├─ config.php
│  │  ├─ cors.php
│  │  ├─ database_connection.php
│  │  ├─ products.php            # CRUD API endpoint
│  ├─ database/
│  ├─ vendor/
│  ├─ .env
│  ├─ .htaccess
│  ├─ composer.json
│  └─ composer.lock
└─ frontend/
   ├─ src/
   │  ├─ assets/
   │  ├─ components/
   │  ├─ context/
   │  ├─ hooks/
   │  ├─ lib/
   │  ├─ pages/
   │  ├─ App.jsx
   │  ├─ config.js
   │  ├─ main.jsx
   │  └─ router.jsx
   ├─ .env
   ├─ package.json
   └─ vite.config.js
```

---

## ⚙️ 1) Environment Variables

**backend/.env**
```ini
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=react_inventory
```

**frontend/.env** (for Vite)
```ini
VITE_API_BASE_URL=http://localhost/react_inventory_system/backend/api
```

---

## 🧩 2) Backend Setup

### `backend/api/database_connection.php`
```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->load();

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
```

### `backend/api/cors.php`
```php
<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // frontend dev server
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
```

### `backend/api/products.php`
```php
<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/database_connection.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM products");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO products (name, sku, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['sku'], $data['quantity'], $data['price']]);
        echo json_encode(['success' => true]);
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        if (!$id) { http_response_code(400); exit(json_encode(['error'=>'Missing id'])); }
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("UPDATE products SET name=?, sku=?, quantity=?, price=? WHERE id=?");
        $stmt->execute([$data['name'], $data['sku'], $data['quantity'], $data['price'], $id]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        $stmt = $pdo->prepare("DELETE FROM products WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
```

---

## 🧮 3) Database Schema
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  quantity INT DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
Import into phpMyAdmin or MySQL CLI.

---

## ⚛️ 4) Frontend Setup

### `frontend/src/config.js`
```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### `frontend/src/lib/products.js`
```js
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = axios.create({ baseURL: `${API_BASE_URL}/products.php` });

export const getProducts = () => API.get();
export const getProduct = (id) => API.get(`?id=${id}`);
export const createProduct = (data) => API.post("", data);
export const updateProduct = (id, data) => API.put(`?id=${id}`, data);
export const deleteProduct = (id) => API.delete(`?id=${id}`);
```

### `frontend/src/pages/ProductsPage.jsx`
```jsx
import React, { useEffect, useState } from "react";
import { getProducts, createProduct } from "../lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const addProduct = async () => {
    await createProduct({ name: "New Item", sku: "SKU1001", quantity: 5, price: 99.99 });
    const { data } = await getProducts();
    setProducts(data);
  };

  return (
    <div className="p-6">
      <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Product
      </button>
      <ul className="mt-4">
        {products.map((p) => (
          <li key={p.id}>{p.name} — {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔄 5) CRUD Operations Summary
| Operation | HTTP Method | Endpoint | Example |
|------------|--------------|-----------|----------|
| Create | POST | `/products.php` | Adds new product |
| Read | GET | `/products.php` | Returns list |
| Read (by ID) | GET | `/products.php?id=1` | Returns one product |
| Update | PUT | `/products.php?id=1` | Updates data |
| Delete | DELETE | `/products.php?id=1` | Removes product |

---

## 🔐 6) Authentication (Supabase Integration Optional)
- Supabase handles user auth on frontend. Tokens can be attached to API requests using the Authorization header.
- Later, you can verify Supabase JWTs in PHP using Supabase’s public keys or REST API.

---

## ⚠️ 7) CORS, Security, and Production Tips
- Change `Access-Control-Allow-Origin` in `cors.php` to your production URL.
- Always validate incoming data on the backend.
- Use HTTPS and environment variables (no secrets in code).
- Protect CRUD endpoints using Supabase auth verification.

---

## 🧰 8) Local Development Commands
```bash
# Backend
composer install

# Frontend
npm install
npm run dev

# Database
mysql -u root -p react_inventory < backend/database/schema.sql
```

---

## 🛠️ 9) Optional: Pretty URLs via .htaccess
To make routes look cleaner (like `/api/products/1`), add this in `backend/.htaccess`:
```apacheconf
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/products/(\d+)$ api/products.php?id=$1 [L,QSA]
```

Then you can call:
```
GET /api/products/1
```
Instead of:
```
GET /api/products.php?id=1
```

---

## ✅ Final Notes
This updated README fully matches your current project setup. It walks through connecting React → PHP → MySQL using Vite + Axios, building a REST-style backend, handling CORS, and integrating future authentication.

Would you like me to expand this with a **Postman Collection** or a **ready-to-deploy production configuration** (Apache + environment-based API URLs)?

