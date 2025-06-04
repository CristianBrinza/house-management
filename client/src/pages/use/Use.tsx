// src/pages/use/Use.tsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
import styles from './Use.module.css';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  type: string;
  sub_type: string;
}

interface UseHistory {
  _id: string;
  name?: string;
  date: string;
  items: { inventoryItem?: string; name: string; quantity: number }[];
}

const Use: React.FC = () => {
  // const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [groupName, setGroupName] = useState('');
  const [history, setHistory] = useState<UseHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Preia lista de inventar
  const fetchInventory = async () => {
    try {
      const res = await axios.get<InventoryItem[]>(
        import.meta.env.VITE_API_URL + '/api/inventory'
      );
      setInventory(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchInventory în Use:', err);
    }
  };

  // Preia istoria
  const fetchHistory = async () => {
    try {
      const res = await axios.get<UseHistory[]>(
        import.meta.env.VITE_API_URL + '/api/use'
      );
      setHistory(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchHistory în Use:', err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchHistory();
  }, []);

  // Actualizează cantitatea selectată pentru un item (0 <= qty <= max)
  const handleQuantityChange = (id: string, qty: number) => {
    setSelected(prev => ({
      ...prev,
      [id]: Math.max(
        0,
        Math.min(qty, inventory.find(it => it._id === id)?.quantity ?? qty)
      ),
    }));
  };

  // Calculul itemilor disponibili: se afișează doar dacă există text în searchTerm
  const availableItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === '') {
      // Dacă nu e nimic în search, nu afișăm nimic
      return [];
    }
    return inventory
      .filter(item => item.quantity > 0)
      .filter(item => item.name.toLowerCase().includes(term));
  }, [inventory, searchTerm]);

  // Determină lista de itemi care vor fi folosiți (cantitate > 0)
  const itemsToUse = useMemo(() => {
    return Object.entries(selected)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const invItem = inventory.find(it => it._id === id);
        return {
          _id: id,
          name: invItem ? invItem.name : '',
          quantity: qty,
        };
      });
  }, [selected, inventory]);

  // Dacă nu există niciun item cu qty > 0, butonul „Use” nu apare
  const canUse = itemsToUse.length > 0;

  // Când apeși „Use”
  const handleUse = async () => {
    if (!canUse) return;
    setLoading(true);
    try {
      const body = {
        name: groupName.trim() === '' ? undefined : groupName.trim(),
        items: itemsToUse,
      };
      await axios.post(import.meta.env.VITE_API_URL + '/api/use', body);

      // Resetare stare
      setSelected({});
      setGroupName('');
      await fetchInventory();
      await fetchHistory();
      alert('Utilizare înregistrată cu succes.');
    } catch (err) {
      console.error('❌ Eroare la handleUse:', err);
      alert('Eroare la înregistrarea utilizării.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.useContainer}>
      <header className={styles.useHeader}>
        <h1>
          <a href="/inventory">← Back</a>
          <br />
          Use Inventory
        </h1>
        {/*<span className={styles.userLabel}>Logged in as: {user?.username}</span>*/}
      </header>

      {/* Afișează ce itemi au fost deja selectați */}
      {canUse && (
        <section className={styles.summarySection}>
          <h3>Items to use:</h3>
          <ul className={styles.summaryList}>
            {itemsToUse.map(it => (
              <li key={it._id}>
                {it.name} − {it.quantity}
              </li>
            ))}
          </ul>
        </section>
      )}
      {canUse && (
        <button
          onClick={handleUse}
          disabled={loading}
          className={styles.useButton}
        >
          {loading ? 'Procesează...' : 'Use'}
        </button>
      )}

      {/* Câmp de căutare și lista itemilor disponibili */}
      <section className={styles.inventoryList}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        {availableItems.length === 0 ? (
          <p className={styles.noItemsMessage}>
            {!inventory.some(it => it.quantity > 0)
              ? 'Nu există itemi disponibili pentru folosit.'
              : 'Începe să tastezi pentru a găsi itemi.'}
          </p>
        ) : (
          availableItems.map(item => {
            // Cantitatea curentă selectată (sau 0 implicit)
            const currentQty = selected[item._id] ?? 0;
            return (
              <div key={item._id} className={styles.inventoryItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemMeta}>
                    Stoc: {item.quantity} ({item.type} | {item.sub_type})
                  </span>
                </div>
                <div className={styles.itemSelect}>
                  {/* Buton „-” scade cu 1, dar nu sub 0 */}
                  <div
                    className={styles.itemSelect_btn}
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        currentQty <= 1 ? 0 : currentQty - 1
                      )
                    }
                  >
                    −
                  </div>

                  <input
                    type="number"
                    min={0}
                    max={item.quantity}
                    step="0.01" // Permite orice zecimal
                    value={currentQty}
                    onChange={e => {
                      const parsed = parseFloat(e.target.value) || 0;
                      handleQuantityChange(
                        item._id,
                        Math.min(item.quantity, parsed)
                      );
                    }}
                    className={styles.quantityInput}
                  />

                  {/* Buton „+” crește cu 1, dar nu peste stoc */}
                  <div
                    className={styles.itemSelect_btn}
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        Math.min(item.quantity, currentQty + 1)
                      )
                    }
                  >
                    +
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Istoric folosiri */}
      <section className={styles.historySection}>
        <h2>Istoric folosiri</h2>
        {history.length === 0 ? (
          <p className={styles.noHistoryMessage}>Nu există istoric.</p>
        ) : (
          history.map(h => (
            <div key={h._id} className={styles.historyItem}>
              <div className={styles.historyHeader}>
                <strong className={styles.historyName}>
                  {h.name || h._id}
                </strong>
                <span className={styles.historyDate}>
                  {new Date(h.date).toLocaleString()}
                </span>
              </div>
              <ul className={styles.historyList}>
                {h.items.map((it, idx) => (
                  <li key={idx} className={styles.historyListItem}>
                    {it.name} − {it.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Use;
