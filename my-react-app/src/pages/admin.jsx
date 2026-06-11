import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import {
  FaChartLine,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaBolt,
  FaEdit,
} from "react-icons/fa";

function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    users: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editMsg, setEditMsg] = useState("");

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    img_url: "",
  });
  const [categories, setCategories] = useState([]);
  const [productMsg, setProductMsg] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAll();
  }, []);

  async function saveEditProduct(e) {
    e.preventDefault();
    setEditMsg("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setEditMsg("✅ Product updated!");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...editingProduct } : p,
          ),
        );
        setTimeout(() => {
          setEditingProduct(null);
          setEditMsg("");
        }, 1000);
      } else {
        setEditMsg(data.message || "Update failed");
      }
    } catch {
      setEditMsg("Something went wrong");
    }
  }
  async function fetchAll() {
    setLoading(true);
    try {
      const [ordersRes, productsRes, usersRes, catsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/orders", { headers }),
        fetch("http://localhost:5000/products"),
        fetch("http://localhost:5000/api/admin/users", { headers }),
        fetch("http://localhost:5000/api/categories"),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const usersData = await usersRes.json();
      const catsData = await catsRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);

      const revenue = ordersData.reduce(
        (s, o) => s + Number(o.total_amount),
        0,
      );
      setStats({
        orders: ordersData.length,
        revenue,
        products: productsData.length,
        users: usersData.length,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
    await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o)),
    );
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: "DELETE",
      headers,
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function addProduct(e) {
    e.preventDefault();
    setProductMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok) {
        setProductMsg("Product added successfully!");
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          category_id: "",
        });
        fetchAll();
      } else {
        setProductMsg(data.message || "Failed to add product");
      }
    } catch {
      setProductMsg("Something went wrong");
    }
  }

async function toggleUserRole(userId, currentRole) {
  const newRole = currentRole === "admin" ? "customer" : "admin";
  if (!window.confirm(`Make this user ${newRole}?`)) return;
  
  try {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  } catch {
    alert("Something went wrong");
  }
}

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user || user.role !== "admin") return null;

  const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <div className="admin-sidebar">
        {/* Logo */}
        <div className="admin-logo">
          <div className="nav-logo-icon">
            <FaBolt size={16} color="white" />
          </div>
          <span>
            IronForge <span style={{ color: "#ff6b00" }}>Admin</span>
          </span>
        </div>

        {/* Menu */}
        <div className="admin-menu">
          {[
            {
              id: "dashboard",
              icon: <FaChartLine size={16} />,
              label: "Dashboard",
            },
            {
              id: "orders",
              icon: <FaShoppingBag size={16} />,
              label: `Orders (${stats.orders})`,
            },
            {
              id: "products",
              icon: <FaBox size={16} />,
              label: `Products (${stats.products})`,
            },
            {
              id: "users",
              icon: <FaUsers size={16} />,
              label: `Users (${stats.users})`,
            },
          ].map((item) => (
            <div
              key={item.id}
              className={`admin-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button className="admin-logout" onClick={handleLogout}>
          <FaSignOutAlt size={14} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "orders" && "Orders Management"}
              {activeTab === "products" && "Products Management"}
              {activeTab === "users" && "Users Management"}
            </h1>
            <p className="admin-page-subtitle">Welcome back, {user.name}</p>
          </div>
          <div className="admin-header-badge">
            <FaBolt size={12} color="white" /> Admin
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div>
                {/* Stats */}
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div
                      className="admin-stat-icon"
                      style={{ background: "#fff5ee" }}
                    >
                      <FaShoppingBag size={20} color="#ff6b00" />
                    </div>
                    <div>
                      <p className="admin-stat-label">Total Orders</p>
                      <p className="admin-stat-value">{stats.orders}</p>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div
                      className="admin-stat-icon"
                      style={{ background: "#f0fff4" }}
                    >
                      <FaChartLine size={20} color="#2e7d32" />
                    </div>
                    <div>
                      <p className="admin-stat-label">Total Revenue</p>
                      <p className="admin-stat-value">
                        Rs.{stats.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div
                      className="admin-stat-icon"
                      style={{ background: "#e8f4fd" }}
                    >
                      <FaBox size={20} color="#1565c0" />
                    </div>
                    <div>
                      <p className="admin-stat-label">Total Products</p>
                      <p className="admin-stat-value">{stats.products}</p>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div
                      className="admin-stat-icon"
                      style={{ background: "#fff9e6" }}
                    >
                      <FaUsers size={20} color="#f57f17" />
                    </div>
                    <div>
                      <p className="admin-stat-label">Total Users</p>
                      <p className="admin-stat-value">{stats.users}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Recent Orders</h2>
                    <button
                      className="admin-view-all"
                      onClick={() => setActiveTab("orders")}
                    >
                      View All →
                    </button>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="admin-order-id">
                            ORD-{String(order.id).padStart(6, "0")}
                          </td>
                          <td>{order.user_name || "Customer"}</td>
                          <td className="admin-amount">
                            Rs.{Number(order.total_amount).toLocaleString()}
                          </td>
                          <td>
                            {order.payment_method === "COD"
                              ? "Cash on Delivery"
                              : order.payment_method}
                          </td>
                          <td>
                            <span
                              className={`admin-status admin-status-${order.order_status || "processing"}`}
                            >
                              {order.order_status || "processing"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>All Orders</h2>
                  <span>{orders.length} total</span>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="admin-order-id">
                          ORD-{String(order.id).padStart(6, "0")}
                        </td>
                        <td>
                          <div>{order.user_name || "Customer"}</div>
                          <div className="admin-sub-text">
                            {order.user_email}
                          </div>
                        </td>
                        <td className="admin-amount">
                          Rs.{Number(order.total_amount).toLocaleString()}
                        </td>
                        <td>
                          {order.payment_method === "COD"
                            ? "Cash on Delivery"
                            : order.payment_method}
                        </td>
                        <td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <select
                            className="admin-status-select"
                            value={order.order_status || "processing"}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div>
                {/* Add Product Form */}
                <div className="admin-card" style={{ marginBottom: "20px" }}>
                  <div className="admin-card-header">
                    <h2>
                      <FaPlus size={14} /> Add New Product
                    </h2>
                  </div>
                  <form onSubmit={addProduct}>
                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label>Product Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Whey Protein Pro"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="admin-field">
                        <label>Category</label>
                        <select
                          value={newProduct.category_id}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              category_id: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="admin-field">
                        <label>Price (Rs.)</label>
                        <input
                          type="number"
                          placeholder="e.g. 2499"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="admin-field">
                        <label>Stock</label>
                        <input
                          type="number"
                          placeholder="e.g. 50"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-field full">
                      <label>Description</label>
                      <textarea
                        placeholder="Product description..."
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                    <div className="admin-field full">
                      <label>Image URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://example.com/image.jpg"
                        value={newProduct.img_url}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            img_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    {productMsg && (
                      <p
                        className={`settings-msg ${productMsg.includes("✅") ? "success" : "error"}`}
                      >
                        {productMsg}
                      </p>
                    )}
                    <button type="submit" className="admin-add-btn">
                      <FaPlus size={12} /> Add Product
                    </button>
                  </form>
                </div>

                {/* Products Table */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>All Products</h2>
                    <span>{products.length} total</span>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.category_name}</td>
                          <td className="admin-amount">
                            Rs.{Number(p.price).toLocaleString()}
                          </td>
                          <td className={p.stock < 10 ? "admin-low-stock" : ""}>
                            {p.stock}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                className="admin-edit-btn"
                                onClick={() => setEditingProduct(p)}
                              >
                                <FaEdit size={12} /> Edit
                              </button>
                              <button
                                className="admin-delete-btn"
                                onClick={() => deleteProduct(p.id)}
                              >
                                <FaTrash size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Edit Product Modal */}
                  {editingProduct && (
                    <div
                      className="admin-modal-overlay"
                      onClick={() => setEditingProduct(null)}
                    >
                      <div
                        className="admin-modal"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="admin-modal-header">
                          <h2>Edit Product</h2>
                          <button
                            className="admin-modal-close"
                            onClick={() => setEditingProduct(null)}
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={saveEditProduct}>
                          <div className="admin-modal-body">
                            <div
                              className="admin-form-grid"
                              style={{ padding: 0 }}
                            >
                              <div className="admin-field">
                                <label>Product Name</label>
                                <input
                                  type="text"
                                  value={editingProduct.name}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="admin-field">
                                <label>Category</label>
                                <select
                                  value={editingProduct.category_id}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      category_id: e.target.value,
                                    })
                                  }
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="admin-field">
                                <label>Price (Rs.)</label>
                                <input
                                  type="number"
                                  value={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="admin-field">
                                <label>Stock</label>
                                <input
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      stock: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div
                              className="admin-field"
                              style={{ marginTop: "16px" }}
                            >
                              <label>Description</label>
                              <textarea
                                value={editingProduct.description || ""}
                                onChange={(e) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    description: e.target.value,
                                  })
                                }
                                rows={3}
                              />
                            </div>

                            <div
                              className="admin-field"
                              style={{ marginTop: "16px" }}
                            >
                              <label>Image URL</label>
                              <input
                                type="text"
                                value={editingProduct.image_url || ""}
                                onChange={(e) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    image_url: e.target.value,
                                  })
                                }
                                placeholder="https://example.com/image.jpg"
                              />
                              {/* Image preview */}
                              {editingProduct.image_url && (
                                <img
                                  src={editingProduct.image_url}
                                  alt="preview"
                                  className="admin-img-preview"
                                />
                              )}
                            </div>

                            {editMsg && (
                              <p
                                className={`settings-msg ${editMsg.includes("✅") ? "success" : "error"}`}
                              >
                                {editMsg}
                              </p>
                            )}
                          </div>

                          <div className="admin-modal-footer">
                            <button
                              type="button"
                              className="admin-cancel-btn"
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </button>
                            <button type="submit" className="admin-save-btn">
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>All Users</h2>
                  <span>{users.length} total</span>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>BMI</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>
                          <div className="admin-user-avatar-row">
                            <div className="admin-user-avatar">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <div style = {{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            className={`admin-role-badge ${u.role === "admin" ? "admin" : "customer"}`}
                          >
                            {u.role}
                          </span>
                          {u.id !== user.id && (
                            <button
                              className={`admin-role-btn ${u.role === "admin" ? "demote" : "promote"}`}
                              onClick={() => toggleUserRole(u.id, u.role)}
                            >
                              {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </button>
                          )}
                          </div>
                        </td>
                        <td>{u.bmi || "—"}</td>
                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
