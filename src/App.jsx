import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Activity, Boxes, ChartNoAxesCombined, CircleUserRound, LogOut,
  Menu, Package, Search, ShoppingCart, Tags, Users, X
} from "lucide-react";
import api, { getErrorMessage, getPayload } from "./api";

function readUser() {
  try { return JSON.parse(localStorage.getItem("currentUser") || "null"); }
  catch { return null; }
}

function App() {
  const [user, setUser] = useState(readUser);
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/*" element={
        user
          ? <Shell user={user} onLogout={logout} mobileNav={mobileNav} setMobileNav={setMobileNav} />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


async function submit(event) {
  event.preventDefault();
  setBusy(true);
  setError("");

  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    const payload = response.data;
    const token = payload?.data?.accessToken;
    const user = payload?.data?.user;

    if (!token) {
      throw new Error("Access token tidak ditemukan pada response login.");
    }

    if (!user) {
      throw new Error("Data user tidak ditemukan pada response login.");
    }

    localStorage.setItem("accessToken", token);

    const currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    onLogin(currentUser);
    navigate("/");
  } catch (error) {
    console.error("Login error:", error);
    setError(getErrorMessage(error));
  } finally {
    setBusy(false);
  }
}


  return <AuthLayout title="Selamat datang" subtitle="Masuk ke Backend API Store from KOPLING to CVT.">
    <form onSubmit={submit} className="form-stack">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@email.com" required />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Masukkan password" required />
      {error && <p className="alert error">{error}</p>}
      <button className="button primary full" disabled={busy}>{busy ? "Memproses..." : "Login"}</button>
    </form>
    <p className="auth-foot">Belum punya akun? <a href="/register">Daftar sekarang</a></p>
  </AuthLayout>;
}

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function update(key, value) { setForm((old) => ({ ...old, [key]: value })); }

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await api.post("/api/auth/register", form);
      setMessage(getPayload(response)?.message || "Registrasi berhasil. Silakan login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setBusy(false); }
  }

  return <AuthLayout title="Buat akun" subtitle="Daftar untuk mulai berbelanja.">
    <form onSubmit={submit} className="form-stack">
      <Field label="Nama" value={form.name} onChange={(v) => update("name", v)} placeholder="Nama lengkap" required />
      <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="nama@email.com" required />
      <Field label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} placeholder="Buat password" required />
      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}
      <button className="button primary full" disabled={busy}>{busy ? "Memproses..." : "Daftar"}</button>
    </form>
    <p className="auth-foot">Sudah punya akun? <a href="/login">Login</a></p>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return <main className="auth-page">
    <section className="auth-panel">
      <div className="brand large"><span className="brand-mark"><Package size={22} /></span><span>Store<span className="brand-dot">.</span></span></div>
      <p className="eyebrow">BACKEND API STORE</p>
      <h1>{title}</h1><p className="muted">{subtitle}</p>
      {children}
      <p className="auth-note">Aplikasi demo untuk integrasi REST API</p>
    </section>
    <aside className="auth-art">
      <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
      <div className="art-card"><Package size={34}/><h2>Everything in one place.</h2><p>Kelola produk, kategori, dan keranjang melalui satu aplikasi.</p><div className="art-bars"><i/><i/><i/><i/><i/></div></div>
    </aside>
  </main>;
}

function Field({ label, type = "text", value, onChange, placeholder, required }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} /></label>;
}

const navItems = [
  { to: "/", label: "Overview", icon: ChartNoAxesCombined },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/cart", label: "My Cart", icon: ShoppingCart },
  { to: "/users", label: "Users", icon: Users, admin: true },
];

function Shell({ user, onLogout, mobileNav, setMobileNav }) {
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand"><span className="brand-mark"><Package size={20}/></span><span>Store<span className="brand-dot">.</span></span></div>
      <div className="workspace"><div className="workspace-icon">S</div><div><b>Store workspace</b><small>API Store</small></div><span className="workspace-chevron">⌄</span></div>
      <p className="nav-caption">WORKSPACE</p>
      <nav>{navItems.filter((item) => !item.admin || isAdmin).map((item) => {
        const Icon = item.icon;
        return <button key={item.to} className={`nav-item ${location.pathname === item.to ? "active" : ""}`} onClick={() => { navigate(item.to); setMobileNav(false); }}><Icon size={18}/><span>{item.label}</span></button>;
      })}</nav>
      <div className="sidebar-bottom"><div className="connection"><span className="status-dot"/><div><b>API connection</b><small>localhost:3000</small></div></div><button className="nav-item" onClick={onLogout}><LogOut size={18}/><span>Logout</span></button></div>
    </aside>
    {mobileNav && <button className="mobile-overlay" aria-label="Tutup menu" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu">{mobileNav ? <X/> : <Menu/>}</button><div className="breadcrumb">Workspace <span>/</span> <b>{navItems.find((n) => n.to === location.pathname)?.label || "Overview"}</b></div><div className="top-user"><div className="avatar">{(user?.email || "U").slice(0,1).toUpperCase()}</div><div><b>{user?.email || "User"}</b><small>{user?.role || "user"}</small></div></div></header>
      <div className="page-content"><Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/products" element={<Products user={user} />} />
        <Route path="/categories" element={<Categories user={user} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/users" element={isAdmin ? <UsersPage /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes></div>
    </main>
  </div>;
}

function PageHeading({ eyebrow = "STORE MANAGEMENT", title, description, action }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{description}</p></div>{action}</div>;
}

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      api.get("/api/products").then((r) => setProducts(asArray(getPayload(r)))),
      api.get("/api/categories").then((r) => setCategories(asArray(getPayload(r)))),
      api.get("/api/cart").then((r) => setCart(getPayload(r))).catch(() => {}),
    ]).catch((e) => setError(getErrorMessage(e)));
  }, []);
  return <>
    <PageHeading title="Overview" description={`Halo ${user?.email || "User"}, berikut ringkasan store kamu.`} />
    {error && <p className="alert error">{error}</p>}
    <div className="stats-grid">
      <Stat icon={Package} label="Total Products" value={products.length} note="Data dari API" />
      <Stat icon={Tags} label="Categories" value={categories.length} note="Kategori tersedia" />
      <Stat icon={ShoppingCart} label="Cart Items" value={cartCount(cart)} note="Item di keranjang" />
      <Stat icon={Activity} label="Account Role" value={user?.role || "user"} note="Role dari JWT" />
    </div>
    <section className="panel welcome-panel"><div><p className="eyebrow">YOUR WORKSPACE</p><h2>Store overview</h2><p className="muted">Frontend terhubung ke backend REST API kamu. Gunakan menu di sebelah kiri untuk menjelajahi fitur.</p><div className="welcome-pills"><span><i className="status-dot"/> API integration</span><span><i className="status-dot"/> JWT authentication</span><span><i className="status-dot"/> PostgreSQL</span></div></div><div className="welcome-graphic"><div className="graphic-square"><Package size={46}/></div><div className="graphic-bubble bubble-a">API</div><div className="graphic-bubble bubble-b">DB</div></div></section>
    <section className="panel"><div className="panel-heading"><div><h2>Quick actions</h2><p className="muted">Akses fitur yang sering digunakan.</p></div></div><div className="quick-grid"><QuickAction icon={Package} title="Browse products" desc="Lihat katalog produk" to="/products"/><QuickAction icon={Tags} title="Explore categories" desc="Lihat kategori produk" to="/categories"/><QuickAction icon={ShoppingCart} title="Open cart" desc="Review item keranjang" to="/cart"/></div></section>
  </>;
}

function Stat({ icon: Icon, label, value, note }) {
  return <section className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={19}/></span></div><strong>{value}</strong><small>{note}</small></section>;
}

function QuickAction({ icon: Icon, title, desc, to }) {
  const navigate = useNavigate();
  return <button className="quick-action" onClick={() => navigate(to)}><span className="quick-icon"><Icon size={20}/></span><b>{title}</b><small>{desc}</small><span className="quick-arrow">↗</span></button>;
}

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
}
function currency(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}
function productId(item) { return item.id ?? item.product_id; }
function productName(item) { return item.name ?? item.product_name ?? "Unnamed product"; }
function cartCount(cart) {
  const items = asArray(cart?.items ?? cart?.cart_items ?? cart);
  return items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
}

function Products({ user }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const isAdmin = user?.role === "admin";
  const load = () => api.get("/api/products").then((r) => setItems(asArray(getPayload(r)))).catch((e) => setError(getErrorMessage(e)));
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => items.filter((p) => `${productName(p)} ${p.description || ""}`.toLowerCase().includes(search.toLowerCase())), [items, search]);

  async function addToCart(product) {
    setBusyId(productId(product)); setError(""); setNotice("");
    try {
      await api.post("/api/cart/items", { productId: productId(product), quantity: 1 });
      setNotice(`${productName(product)} berhasil ditambahkan ke cart.`);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setBusyId(null); }
  }

  async function removeProduct(product) {
    if (!confirm(`Hapus produk "${productName(product)}"?`)) return;
    try { await api.delete(`/api/products/${productId(product)}`); setItems((old) => old.filter((p) => productId(p) !== productId(product))); }
    catch (e) { setError(getErrorMessage(e)); }
  }

  async function createProduct() {
    const name = prompt("Nama produk:");
    if (!name?.trim()) return;
    const price = Number(prompt("Harga (angka):", "10000"));
    const stock = Number(prompt("Stock:", "1"));
    const description = prompt("Deskripsi:", "") || "";
    const categoryId = Number(prompt("Category ID:", "1"));
    try {
      await api.post("/api/products", { name: name.trim(), price, stock, description, category_id: categoryId });
      setNotice("Produk berhasil dibuat."); await load();
    } catch (e) { setError(getErrorMessage(e)); }
  }

  return <>
    <PageHeading title="Products" description="Jelajahi dan kelola katalog produk." action={isAdmin && <button className="button primary" onClick={createProduct}>+ Add product</button>} />
    <div className="toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..." /></div><span className="result-count">{filtered.length} products</span></div>
    {error && <p className="alert error">{error}</p>}{notice && <p className="alert success">{notice}</p>}
    <div className="product-grid">{filtered.map((p) => <article className="product-card" key={productId(p)}><div className="product-art"><Package size={42}/><span className="product-art-tag">PRODUCT</span></div><div className="product-info"><div className="product-title-row"><h3>{productName(p)}</h3><span className="stock-badge">{p.stock ?? "—"} in stock</span></div><p className="product-desc">{p.description || "Tidak ada deskripsi produk."}</p><div className="product-bottom"><strong>{currency(p.price)}</strong><div className="product-actions">{isAdmin && <button className="icon-button danger-text" title="Hapus produk" onClick={() => removeProduct(p)}><X size={17}/></button>}<button className="button primary small" disabled={busyId === productId(p)} onClick={() => addToCart(p)}>{busyId === productId(p) ? "Adding..." : "Add to cart"}</button></div></div></div></article>)}</div>
    {!filtered.length && !error && <Empty title="Produk tidak ditemukan" desc="Coba kata kunci lain atau pastikan seed data sudah tersedia." />}
  </>;
}

function Categories({ user }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isAdmin = user?.role === "admin";
  const load = () => api.get("/api/categories").then((r) => setItems(asArray(getPayload(r)))).catch((e) => setError(getErrorMessage(e)));
  useEffect(() => { load(); }, []);
  async function create() {
    const name = prompt("Nama kategori:");
    if (!name?.trim()) return;
    const description = prompt("Deskripsi kategori:", "") || "";
    try { await api.post("/api/categories", { name: name.trim(), description }); setNotice("Kategori berhasil dibuat."); await load(); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  async function remove(item) {
    if (!confirm(`Hapus kategori "${item.name}"?`)) return;
    try { await api.delete(`/api/categories/${item.id ?? item.category_id}`); await load(); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  return <>
    <PageHeading title="Categories" description="Kelompokkan produk berdasarkan kategori." action={isAdmin && <button className="button primary" onClick={create}>+ Add category</button>} />
    {error && <p className="alert error">{error}</p>}{notice && <p className="alert success">{notice}</p>}
    <div className="category-grid">{items.map((c, i) => <article className="category-card" key={c.id ?? c.category_id}><div className={`category-icon category-tone-${i % 4}`}><Tags size={24}/></div><div className="category-content"><h3>{c.name ?? c.category_name}</h3><p>{c.description || "Kategori produk"}</p><small>ID: {c.id ?? c.category_id}</small></div>{isAdmin && <button className="icon-button danger-text" title="Hapus kategori" onClick={() => remove(c)}><X size={17}/></button>}</article>)}</div>
    {!items.length && !error && <Empty title="Belum ada kategori" desc="Tambahkan kategori atau jalankan seed.sql di database." />}
  </>;
}

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true); setError("");
    try { setCart(getPayload(await api.get("/api/cart"))); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const items = asArray(cart?.items ?? cart?.cart_items ?? cart);
  const total = items.reduce((sum, item) => sum + Number(item.price ?? item.product_price ?? 0) * Number(item.quantity || 1), 0);
  async function update(item, quantity) {
    if (quantity < 1) return;
    const id = item.id ?? item.cart_item_id;
    try { await api.put(`/api/cart/items/${id}`, { quantity }); await load(); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  async function remove(item) {
    const id = item.id ?? item.cart_item_id;
    try { await api.delete(`/api/cart/items/${id}`); setNotice("Item dihapus."); await load(); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  async function clear() {
    if (!confirm("Kosongkan seluruh cart?")) return;
    try { await api.delete("/api/cart"); setNotice("Cart berhasil dikosongkan."); await load(); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  return <>
    <PageHeading title="My Cart" description="Periksa produk yang ingin kamu beli." action={items.length > 0 && <button className="button secondary" onClick={clear}>Clear cart</button>} />
    {error && <p className="alert error">{error}</p>}{notice && <p className="alert success">{notice}</p>}
    {loading ? <div className="panel loading">Memuat cart...</div> : items.length ? <div className="cart-layout"><section className="panel cart-list">{items.map((item) => {
      const name = item.name ?? item.product_name ?? item.product?.name ?? "Product";
      const price = item.price ?? item.product_price ?? item.product?.price ?? 0;
      const qty = Number(item.quantity || 1);
      return <div className="cart-row" key={item.id ?? item.cart_item_id}><div className="cart-product-icon"><Package/></div><div className="cart-item-info"><b>{name}</b><small>{currency(price)} / item</small><div className="quantity-control"><button onClick={() => update(item, qty - 1)} disabled={qty <= 1}>−</button><span>{qty}</span><button onClick={() => update(item, qty + 1)}>+</button></div></div><div className="cart-item-end"><b>{currency(Number(price) * qty)}</b><button className="text-button danger-text" onClick={() => remove(item)}>Remove</button></div></div>;
    })}</section><aside className="panel order-summary"><h2>Order summary</h2><div className="summary-line"><span>Items</span><b>{cartCount(items)}</b></div><div className="summary-line"><span>Subtotal</span><b>{currency(total)}</b></div><div className="summary-line"><span>Shipping</span><span>Belum dihitung</span></div><div className="summary-total"><span>Total</span><strong>{currency(total)}</strong></div><p className="muted summary-note">Checkout dan pembayaran belum tersedia pada backend saat ini.</p></aside></div> : <Empty title="Cart kamu masih kosong" desc="Tambahkan produk dari halaman Products untuk mulai mengisi keranjang." />}
  </>;
}

function UsersPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    try { setItems(asArray(getPayload(await api.get("/api/users")))); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  useEffect(() => { load(); }, []);
  async function remove(user) {
    if (!confirm(`Hapus user ${user.email}?`)) return;
    try { await api.delete(`/api/users/${user.id}`); setNotice("User berhasil dihapus."); await load(); }
    catch (e) { setError(getErrorMessage(e)); }
  }
  return <>
    <PageHeading title="Users" description="Manajemen akun pengguna (khusus admin)." />
    {error && <p className="alert error">{error}</p>}{notice && <p className="alert success">{notice}</p>}
    <div className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>User ID</th><th>Action</th></tr></thead><tbody>{items.map((u) => <tr key={u.id}><td><div className="table-user"><div className="avatar">{(u.name || u.email || "U").slice(0,1).toUpperCase()}</div><div><b>{u.name || "—"}</b><small>{u.email}</small></div></div></td><td><span className={`role-badge ${u.role === "admin" ? "admin" : ""}`}>{u.role}</span></td><td>#{u.id}</td><td><button className="text-button danger-text" onClick={() => remove(u)}>Delete</button></td></tr>)}</tbody></table></div>{!items.length && <p className="muted table-empty">Tidak ada data user atau API tidak dapat diakses.</p>}</div>
  </>;
}

function Empty({ title, desc }) {
  return <div className="empty-state"><div className="empty-icon"><Package size={26}/></div><h3>{title}</h3><p>{desc}</p></div>;
}

export default App;