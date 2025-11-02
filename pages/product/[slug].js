import { useRouter } from "next/router";
import { products } from "../../data/products";
import Head from "next/head";
import Link from "next/link";
import Styles from "../../styles/Slug.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useCart } from "../../lib/CartContext";

export default function ProductDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug);
  const [count, setCount] = useState(1);

  if (!product) return <p></p>;

  function increase() {
    setCount(prev => prev + 1);
  }

  function Decrease() {
    if (count > 1) setCount(prev => prev - 1);
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
                  <i className="fa-solid fa-minus" onClick={Decrease}></i>
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
            <img src={product.fimage1} />
            <img src={product.fimage3} />
          </div>
          <img src={product.fimage2} />
        </summary>
        <h4>you may also like</h4>
        <aside>
          <div>
            <img src="/darkhead.png" />
            <h2>XX59</h2>
            <Link href="/product/xx99-mark-two">
              <button>SEE PRODUCT</button>
            </Link>
          </div>
          <div>
            <img src="/whitehead.png" />
            <h2>XX99 MARK II</h2>
            <Link href="/product/xx59-headphone">
              <button>SEE PRODUCT</button>
            </Link>
          </div>
          <div>
            <img src="/speaker2.png" />
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
                      <img src="/arrow.png" alt="" />
                  </p>
              </Link>
              
          </div>
          <div>
              <img src="/speaker.png" alt="speaker" />
              <h4>SPEAKERS</h4>
              <Link href="/Speaker">
                  <p>
                      SHOP 
                      <img src="/arrow.png" alt="" />
                  </p>
              </Link>
          </div>
          <div>
              <img src="/earphone.png" alt="earphone" />
              <h4>EARPHONES</h4>
              <Link href="/Earphone">
                  <p>
                      SHOP 
                      <img src="/arrow.png" alt="" />
                  </p>
              </Link>
          </div>
      </main>
        
        <Footer />
      </div>
    </>
  );
}
