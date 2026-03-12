// @ts-nocheck
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "48px 24px",
        borderTop: "1px solid rgba(232,226,214,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "var(--cream)", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 24,
              height: 24,
              background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--bg)",
            }}
          >
            R
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            Redpoint Solutions
          </span>
        </Link>
        <div style={{ fontSize: "0.78rem", color: "rgba(232,226,214,0.35)" }}>
          A Redpoint Consulting company &bull; Denver Metro, Colorado
        </div>
        <div style={{ fontSize: "0.78rem", color: "rgba(232,226,214,0.35)" }}>
          &copy; {new Date().getFullYear()} M G Enterprises LLC
        </div>
      </div>
    </footer>
  );
}
