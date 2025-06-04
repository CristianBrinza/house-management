// src/pages/drunked/Drunked.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './Drunked.module.css';

interface DrunkedDrink {
  _id: string;
  name: string;
  type: string;
  date: string;
  price: number;
  consumedAt: string; // ISO date
}

const Drunked: React.FC = () => {
  const [drunked, setDrunked] = useState<DrunkedDrink[]>([]);

  const fetchDrunked = async () => {
    try {
      const res = await axios.get<DrunkedDrink[]>(
        import.meta.env.VITE_API_URL + '/api/drunk'
      );
      setDrunked(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchDrunked:', err);
    }
  };

  useEffect(() => {
    fetchDrunked();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <a href="/drinks">← Back</a>
          <br />
          Drunked Drinks
        </h1>
      </header>

      <section className={styles.listSection}>
        {drunked.length === 0 ? (
          <p>No consumed drinks yet.</p>
        ) : (
          drunked.map(d => (
            <div key={d._id} className={styles.drunkItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{d.name}</span>
                <span className={styles.itemMeta}>
                  {d.type} | {d.date} | ${d.price.toFixed(2)}
                  <br />
                  Consumed at: {new Date(d.consumedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Drunked;
