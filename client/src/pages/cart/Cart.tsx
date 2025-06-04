// src/pages/cart/Cart.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
import styles from './Cart.module.css';

interface ShoppingList {
  _id: string;
  name: string;
  items: { name: string; quantity: number }[];
}

interface InventoryItem {
  _id: string;
  name: string;
}

const Cart: React.FC = () => {
  // const { user } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [inventoryNames, setInventoryNames] = useState<string[]>([]);

  // preia listele și inventarul doar cu nume (pentru sugestii)
  const fetchLists = async () => {
    try {
      const res = await axios.get<ShoppingList[]>(
        import.meta.env.VITE_API_URL + '/api/lists'
      );
      setLists(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchLists:', err);
    }
  };

  const fetchInventoryNames = async () => {
    try {
      const res = await axios.get<InventoryItem[]>(
        import.meta.env.VITE_API_URL + '/api/inventory'
      );
      setInventoryNames(res.data.map(it => it.name));
    } catch (err) {
      console.error('❌ Eroare la fetchInventoryNames:', err);
    }
  };

  useEffect(() => {
    fetchLists();
    fetchInventoryNames();
  }, []);

  // creare listă nouă
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      alert('Nume listă obligatoriu.');
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/lists', {
        name: newListName.trim(),
      });
      setNewListName('');
      fetchLists();
    } catch (err: any) {
      console.error('❌ Eroare la handleCreateList:', err);
      alert(err.response?.data?.error || 'Eroare la creare listă.');
    }
  };

  // șterge listă
  const handleDeleteList = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această listă?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/lists/${id}`);
      fetchLists();
    } catch (err) {
      console.error('❌ Eroare la handleDeleteList:', err);
      alert('Eroare la ștergere.');
    }
  };

  // adaugă item în listă
  const handleAddItemToList = async (
    listId: string,
    name: string,
    qty: number
  ) => {
    if (!name.trim() || qty <= 0) {
      alert('Denumire și cantitate > 0 obligatorii.');
      return;
    }
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + `/api/lists/${listId}/items`,
        { name: name.trim(), quantity: qty }
      );
      fetchLists();
    } catch (err: any) {
      console.error('❌ Eroare la handleAddItemToList:', err);
      alert(err.response?.data?.error || 'Eroare la adăugare item.');
    }
  };

  // șterge item din listă
  const handleDeleteItemFromList = async (listId: string, itemName: string) => {
    if (!confirm(`Ștergi ${itemName} din listă?`)) return;
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL +
          `/api/lists/${listId}/items/${encodeURIComponent(itemName)}`
      );
      fetchLists();
    } catch (err) {
      console.error('❌ Eroare la handleDeleteItemFromList:', err);
      alert('Eroare la ștergere item.');
    }
  };

  // buy (cumpără) item din listă
  const handleBuyItem = async (
    listId: string,
    itemName: string,
    qty: number
  ) => {
    if (qty <= 0) {
      alert('Cantitate > 0 obligatoriu.');
      return;
    }
    try {
      await axios.post(
        import.meta.env.VITE_API_URL +
          `/api/lists/${listId}/buy/${encodeURIComponent(itemName)}`,
        { quantity: qty }
      );
      await fetchLists();
      alert(`${itemName} adăugat în inventory (${qty}).`);
    } catch (err) {
      console.error('❌ Eroare la handleBuyItem:', err);
      alert('Eroare la cumpărare item.');
    }
  };

  return (
    <div className={styles.cartContainer}>
      <header className={styles.cartHeader}>
        <h1>
          <a href="/inventory">← Back</a>
          <br />
          Cart / Buy
        </h1>
        {/*<span>Logged in as: {user?.username}</span>*/}
      </header>

      <section className={styles.createListSection}>
        <input
          type="text"
          placeholder="Numele noii liste"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
        />
        <button onClick={handleCreateList}>Create List</button>
      </section>

      <section className={styles.listsSection}>
        {lists.length === 0 && <p>Nu există liste.</p>}
        {lists.map(list => (
          <div key={list._id} className={styles.singleList}>
            <div className={styles.listHeader}>
              <h2>{list.name}</h2>
              <button onClick={() => handleDeleteList(list._id)}>
                Delete List
              </button>
            </div>

            <div className={styles.listItems}>
              {list.items.length === 0 && <p>Lista este goală.</p>}
              {list.items.map((it, idx) => (
                <div key={idx} className={styles.listItem}>
                  <span>
                    {it.name} (Qty: {it.quantity})
                  </span>
                  <div className={styles.listItemButtons}>
                    <button
                      onClick={() =>
                        handleDeleteItemFromList(list._id, it.name)
                      }
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        const buyQty = it.quantity;
                        if (
                          window.confirm(`Confirm buy ${it.name} (${buyQty})?`)
                        ) {
                          handleBuyItem(list._id, it.name, buyQty);
                        }
                      }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <AddItemForm
              listId={list._id}
              inventoryNames={inventoryNames}
              onAdd={(name, qty) => handleAddItemToList(list._id, name, qty)}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Cart;

// Componentă internă pentru adăugat item cu autocomplete (datalist)
interface AddItemFormProps {
  listId: string;
  inventoryNames: string[];
  onAdd: (name: string, qty: number) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  listId,
  inventoryNames,
  onAdd,
}) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);

  return (
    <form
      className={styles.addItemForm}
      onSubmit={e => {
        e.preventDefault();
        onAdd(itemName, quantity);
        setItemName('');
        setQuantity(1);
      }}
    >
      <input
        list={`inventory-suggestions-${listId}`}
        placeholder="Nume item..."
        value={itemName}
        onChange={e => setItemName(e.target.value)}
        required
      />
      <datalist id={`inventory-suggestions-${listId}`}>
        {inventoryNames.map(n => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <input
        type="number"
        step="1"
        min="1"
        value={quantity}
        onChange={e => setQuantity(parseInt(e.target.value))}
        required
      />
      <button type="submit">Add Item</button>
    </form>
  );
};
