// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrolled = scrollY > 50;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 0",
        background: scrolled ? "rgba(26,24,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.4s ease",
        borderBottom: scrolled ? "1px solid rgba(196,149,106,0.12)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "var(--cream)", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--bg)",
            }}
          >
            R
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Redpoint Home Solutions
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: 32,
            alignItems: "center",
            fontSize: "0.88rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          <Link href="/situations/inherited-property" style={{ color: "var(--cream)", textDecoration: "none", opacity: 0.8 }}>
            Situations
          </Link>
          <Link href="/about" style={{ color: "var(--cream)", textDecoration: "none", opacity: 0.8 }}>
            About
          </Link>
          <a href="/#faq" style={{ color: "var(--cream)", textDecoration: "none", opacity: 0.8 }}>
            FAQ
          </a>
          <Link
            href="/contact"
            style={{
              background: "linear-gradient(135deg, var(--warm), var(--warm-dark))",
              color: "var(--bg)",
              padding: "10px 22px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "0.03em",
            }}
          >
            Get Help Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
