import { useRouter } from "next/router";
import { products } from "../../data/products";
import Head from "next/head";
import Link from "next/link";
import Styles from "../../styles/Slug.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer.tsx";
import { useState } from "react";
import { useCart } from "../../lib/CartContext";

interface Product {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features1?: string;
  features?: string;
  fimage1?: string;
  fimage2?: string;
  fimage3?: string;
}

export default function ProductDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();

  const product: Product | undefined = products.find((p) => p.slug === slug);
  const [count, setCount] = useState<number>(1);

  if (!product) return <p></p>;

  function increase() {
    setCount((prev) => prev + 1);
  }

  function decrease() {
    if (count > 1) setCount((prev) => prev - 1);
  }

  function handleAddToCart() {
    addToCart(product, count);
  }

  return (
    <>
      <Head>
        <title>{product.name} | Audiophile</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </Head>

      <div id={Styles.ProductDetails}>
        <section>
          <Header />
        </section>

        <nav>
          <button onClick={() => router.back()}>Go Back</button>
        </nav>

        <div>
          <article>
            <img src={product.image} alt={product.name} />
            <nav>
              <span>NEW PRODUCT</span>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <li>${product.price}</li>
              <div>
                <aside>
                  <i className="fa-solid fa-minus" onClick={decrease}></i>
                  <label id="counter">{count}</label>
                  <i className="fa-solid fa-plus" onClick={increase}></i>
                </aside>
                <button onClick={handleAddToCart}>ADD TO CART</button>
              </div>
            </nav>
          </article>

          <summary>
            <div>
              <h2>FEATURES</h2>
              <p>{product.features1}</p>
              <p>{product.features}</p>
            </div>

            <nav>
              <h2>IN THE BOX</h2>
              <p>
                <span>1x</span>Headphone Unit
              </p>
              <p>
                <span>2x</span>Replacement Earcups
              </p>
              <p>
                <span>1x</span>User Manual
              </p>
              <p>
                <span>1x</span>3.5mm 5m Audio Cable
              </p>
              <p>
                <span>1x</span>Travel Bag
              </p>
            </nav>
          </summary>
        </div>

        <summary>
          <div>
            <img src={product.fimage1} alt={product.name} />
            <img src={product.fimage3} alt={product.name} />
          </div>
          <img src={product.fimage2} alt={product.name} />
        </summary>

        <h4>You may also like</h4>
        <aside>
          <div>
            <img src="/darkhead.png" alt="XX59" />
            <h2>XX59</h2>
            <Link href="/product/xx99-mark-two">
              <button>SEE PRODUCT</button>
            </Link>
          </div>
          <div>
            <img src="/whitehead.png" alt="XX99 MARK II" />
            <h2>XX99 MARK II</h2>
            <Link href="/product/xx59-headphone">
              <button>SEE PRODUCT</button>
            </Link>
          </div>
          <div>
            <img src="/speaker2.png" alt="ZX9 SPEAKER" />
            <h2>ZX9 SPEAKER</h2>
            <Link href="/product/zx9-speaker">
              <button>SEE PRODUCT</button>
            </Link>
          </div>
        </aside>

        <main>
          <div>
            <img src="/headphone.png" alt="headphone" />
            <h4>HEADPHONES</h4>
            <Link href="/Headphone">
              <p>
                SHOP
                <img src="/arrow.png" alt="arrow" />
              </p>
            </Link>
          </div>
          <div>
            <img src="/speaker.png" alt="speaker" />
            <h4>SPEAKERS</h4>
            <Link href="/Speaker">
              <p>
                SHOP
                <img src="/arrow.png" alt="arrow" />
              </p>
            </Link>
          </div>
          <div>
            <img src="/earphone.png" alt="earphone" />
            <h4>EARPHONES</h4>
            <Link href="/Earphone">
              <p>
                SHOP
                <img src="/arrow.png" alt="arrow" />
              </p>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
