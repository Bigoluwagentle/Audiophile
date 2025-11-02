import Link from "next/link";
import Styles from "../../styles/Header.module.css";
import Head from "next/head";
import { useCart } from "../../lib/CartContext";
import { useEffect, useMemo } from "react";

export default function Header() {
  const { cart, removeAll, updateQuantity } = useCart();

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    const cartIcon = document.querySelector("#cartIcon");
    const dropdown = document.querySelector("#dropdown");

    function toggleDropdown(e) {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    }

    function closeDropdown() {
      dropdown.style.display = "none";
    }

    cartIcon.addEventListener("click", toggleDropdown);
    window.addEventListener("click", closeDropdown);

    return () => {
      cartIcon.removeEventListener("click", toggleDropdown);
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </Head>

      <header id={Styles.header}>
        <i class="fa-solid fa-bars" id="menu"></i>
        <Link href="/">
          <i class="fa-solid fa-bars" style={{color: "#FFF", cursor: "pointer", display: "none"}}></i>
          <img src="/logo.svg" alt="logo" />
        </Link>

        <nav>
          <Link href="/">HOME</Link>
          <Link href="/Headphone">HEADPHONES</Link>
          <Link href="/Speaker">SPEAKERS</Link>
          <Link href="/Earphone">EARPHONES</Link>
        </nav>

        <div>
          <img id="cartIcon" src="/cart.svg" alt="cart" />

          <aside id="dropdown" style={{ display: "none" }}>
            <section>
              <h2>CART ({cart.length})</h2>
              {cart.length > 0 && (
                <button onClick={removeAll}>Remove all</button>
              )}
            </section>

            <article>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <section key={item.slug}>
                    <nav>
                      <div>
                        <img src={item.image} alt={item.name} />
                        <nav>
                          <h4>{item.names}</h4>
                          <p>${item.price}</p>
                        </nav>
                      </div>

                      <aside>
                        <i
                          className="fa-solid fa-minus"
                          onClick={() => updateQuantity(item.slug, "dec")}
                        ></i>
                        <label id="counter">{item.quantity}</label>
                        <i
                          className="fa-solid fa-plus"
                          onClick={() => updateQuantity(item.slug, "inc")}
                        ></i>
                      </aside>
                    </nav>
                  </section>
                ))
              )}
            </article>

            {cart.length > 0 && (
              <>
                <summary id="summary">
                  <span>TOTAL</span>
                  <h4>${total.toLocaleString()}</h4>
                </summary>

                <button
                  onClick={() => document.querySelector("#check").click()}
                >
                  Checkout
                </button>
                <Link href="/Checkout" id="check"></Link>
              </>
            )}
          </aside>
        </div>
      </header>
    </>
  );
}
