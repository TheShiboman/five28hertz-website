# 🎨 Argento Homes UI Theme & Branding Guide

This section outlines the branding and theme integration applied across the Argento Homes Portal for consistent UI/UX design.

---

## 🌈 Theme Color Palette

| Name        | Token               | Hex        | Usage                       |
|-------------|---------------------|------------|-----------------------------|
| Primary     | `brand`             | `#4F46E5`  | Main UI elements, CTAs      |
| Accent      | `brand-light`       | `#6366F1`  | Hover states, highlights    |
| Success     | `brand-success`     | `#22C55E`  | Approved, success states    |
| Warning     | `brand-warning`     | `#FACC15`  | Pending, caution alerts     |
| Danger      | `brand-danger`      | `#EF4444`  | Error, reject buttons       |
| Muted       | `brand-muted`       | `#6B7280`  | Subdued text, placeholder   |
| Text        | `brand-text`        | `#111827`  | Default foreground text     |
| Background  | `brand-background`  | `#F9FAFB`  | Default page background     |

---

## ⚙️ Tailwind Configuration

Update your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          success: '#22C55E',
          warning: '#FACC15',
          danger: '#EF4444',
          muted: '#6B7280',
          text: '#111827',
          background: '#F9FAFB',
        }
      }
    }
  }
}
```

---

## 🧩 UI Components Guidelines

### 🔘 Buttons

```jsx
<button className="bg-brand text-white hover:bg-brand-light px-4 py-2 rounded-xl shadow">
  Confirm
</button>
```

Variants:
- ✅ Success → `bg-brand-success`
- ⚠️ Warning → `bg-brand-warning`
- ❌ Danger → `bg-brand-danger`

---

## 🧭 Sidebar & Navigation

```jsx
<div className="bg-brand text-white w-64 p-4">
  <h1 className="text-2xl font-bold">Argento Homes</h1>
  <ul className="mt-6 space-y-4">
    <li className="hover:text-brand-light">Dashboard</li>
    ...
  </ul>
</div>
```

---

## 🖼 Logo Integration

Replace placeholder with official logo:

```jsx
<img src="/logo.png" alt="Argento Homes Logo" className="h-10 w-auto" />
```

Ensure the file `logo.png` is saved in `/public` or `/assets` and linked correctly.

---

## 📐 Global Styling

In your `global.css` or `index.css`:

```css
body {
  background-color: #F9FAFB;
  color: #111827;
  font-family: 'Inter', sans-serif;
}
```

Font suggestion: [Inter](https://fonts.google.com/specimen/Inter)

---

## ✅ Brand Integration Status

| Section                | Status   |
|------------------------|----------|
| Theme Colors Applied   | ✅ Done   |
| Logo Integrated        | ✅ Done   |
| Buttons/Alerts Styled  | ✅ Done   |
| Sidebar Themed         | ✅ Done   |
| Font/Global Layout     | ✅ Optional |

---

> This README section ensures every contributor follows the Argento Homes design DNA. Push updates with branding changes to GitHub to track evolution.