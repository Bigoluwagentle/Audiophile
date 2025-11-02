import Head from "next/head";
import { useRouter } from "next/router";
import { useState, ChangeEvent, FormEvent } from "react";
import { useCart } from "../lib/CartContext";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import Header from "./components/Header";
import Styles from "../styles/Checkout.module.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  payment: string;
  eMoneyNumber: string;
  eMoneyPin: string;
}

interface ErrorMap {
  [key: string]: string;
}

export default function Checkout() {
  const { cart = [], total = 0 } = useCart() || {};
  const router = useRouter();
  const saveOrder = useMutation(api.order.saveOrder);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    payment: "e-Money",
    eMoneyNumber: "",
    eMoneyPin: "",
  });

  const [errors, setErrors] = useState<ErrorMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id || e.target.name;
    const val = e.target.value;
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: ErrorMap = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zip.trim()) newErrors.zip = "Zip Code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (formData.payment === "e-Money") {
      if (!formData.eMoneyNumber.trim())
        newErrors.eMoneyNumber = "e-Money Number is required";
      if (!formData.eMoneyPin.trim())
        newErrors.eMoneyPin = "e-Money PIN is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    const payload = {
      ...formData,
      items: cart,
      total: total + 50,
    };

    try {
      await saveOrder(payload);

      await fetch("/api/sendConfirmationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
          items: payload.items,
          total: payload.total,
        }),
      });

      setShowModal(true);

    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to save order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackHome = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Audiophile | Checkout</title>
        <meta name="description" content="Audiophile checkout page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div id={Styles.checkout}>
        <div>
          <Header />
        </div>

        {showModal && (
          <article className={Styles.overlay}>
            <div className={Styles.modal}>
              <div className={Styles.icon}>
                <img src="/confirm.png" alt="success" width="50px" />
              </div>
              <h2>THANK YOU<br />FOR YOUR ORDER</h2>
              <p>You will receive an email confirmation shortly.</p>

              <div className={Styles.orderSummary}>
                <div className={Styles.left}>
                  <div className={Styles.item}>
                    <img src={cart[0]?.image} alt={cart[0]?.name} />
                    <div>
                      <h4>{cart[0]?.name}</h4>
                      <p>$ {cart[0]?.price}</p>
                    </div>
                    <span>x{cart[0]?.quantity}</span>
                  </div>
                  {cart.length > 1 && (
                    <p className={Styles.otherItems}>
                      and {cart.length - 1} other item(s)
                    </p>
                  )}
                </div>
                <nav className={Styles.right}>
                  <p>GRAND TOTAL</p>
                  <h3>$ {total + 50}</h3>
                </nav>
              </div>

              <button onClick={handleBackHome}>BACK TO HOME</button>
            </div>
          </article>
        )}

        <button onClick={() => router.back()}>
          Go Back
        </button>

        <form onSubmit={handleSubmit}>
          <main>
            <section>
              <h4>CHECKOUT</h4>
              <div>
                <span>Billing Details</span>
                <nav>
                  <aside>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Alexei Ward"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <p className={Styles.error}>{errors.name}</p>
                  </aside>
                  <aside>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text"
                      id="email"
                      placeholder="alexei@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <p className={Styles.error}>{errors.email}</p>
                  </aside>
                </nav>
                <aside>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="+1 202-555-0136"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <p className={Styles.error}>{errors.phone}</p>
                </aside>
              </div>

              <div>
                <span>Shipping Info</span>
                <aside>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="113 Williams Avenue"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <p className={Styles.error}>{errors.address}</p>
                </aside>
                <nav>
                  <aside>
                    <label htmlFor="zip">Zip Code</label>
                    <input
                      type="text"
                      id="zip"
                      placeholder="10001"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                    <p className={Styles.error}>{errors.zip}</p>
                  </aside>
                  <aside>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <p className={Styles.error}>{errors.city}</p>
                  </aside>
                </nav>
                <aside>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                  />
                  <p className={Styles.error}>{errors.country}</p>
                </aside>
              </div>

              <div>
                <span>Payment Details</span>
                <section>
                  <span>Payment Method</span>
                  <nav>
                    <aside>
                      <input
                        type="radio"
                        name="payment"
                        value="e-Money"
                        checked={formData.payment === "e-Money"}
                        onChange={handleChange}
                      />
                      <p>e-Money</p>
                    </aside>
                    <aside>
                      <input
                        type="radio"
                        name="payment"
                        value="Cash on Delivery"
                        checked={formData.payment === "Cash on Delivery"}
                        onChange={handleChange}
                      />
                      <p>Cash on Delivery</p>
                    </aside>
                  </nav>
                </section>

                {formData.payment === "e-Money" && (
                  <nav>
                    <aside>
                      <label htmlFor="eMoneyNumber">e-Money Number</label>
                      <input
                        type="text"
                        id="eMoneyNumber"
                        placeholder="238521993"
                        value={formData.eMoneyNumber}
                        onChange={handleChange}
                      />
                      <p className={Styles.error}>{errors.eMoneyNumber}</p>
                    </aside>
                    <aside>
                      <label htmlFor="eMoneyPin">e-Money Pin</label>
                      <input
                        type="text"
                        id="eMoneyPin"
                        placeholder="6891"
                        value={formData.eMoneyPin}
                        onChange={handleChange}
                      />
                      <p className={Styles.error}>{errors.eMoneyPin}</p>
                    </aside>
                  </nav>
                )}
              </div>
            </section>

            <aside className={Styles.summary}>
              <h2>Summary</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <nav key={item.slug}>
                    <div>
                      <img src={item.image} alt={item.name} />
                      <nav>
                        <h4>{item.names}</h4>
                        <p>$ {item.price}</p>
                      </nav>
                    </div>
                    <li>{item.quantity}x</li>
                  </nav>
                ))
              )}
              <summary>
                <span>TOTAL</span>
                <h4>$ {total}</h4>
              </summary>
              <summary>
                <span>SHIPPING</span>
                <h4>$ 50</h4>
              </summary>
              <summary>
                <span>VAT (INCLUDED)</span>
                <h4>$ {Math.round(total * 0.2)}</h4>
              </summary>
              <summary>
                <span>GRAND TOTAL</span>
                <h4 style={{ color: "#D87D4A" }}>$ {total + 50}</h4>
              </summary>

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "CONFIRM & PAY"}
              </button>
            </aside>
          </main>
        </form>
      </div>
    </>
  );
}
