// src/pages/inventory/Inventory.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Inventory.module.css';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  type: string;
  sub_type: string;
}

interface TypeItem {
  _id: string;
  name: string;
  sub_types: string[];
}

const quickQuantities = [0, 0.25, 0.5, 1];

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // state pentru formularul de adăugare
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newType, setNewType] = useState('');
  const [newSubType, setNewSubType] = useState('');

  // state pentru căutare și filtrare
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterSubType, setFilterSubType] = useState<string | null>(null);

  // state pentru popup modificare
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editType, setEditType] = useState<string>('');
  const [editSubType, setEditSubType] = useState<string>('');

  // state pentru listele de tipuri și subtips-uri
  const [types, setTypes] = useState<TypeItem[]>([]);

  const [addmenu, setAddmenu] = useState(false);

  // Fetch items cu opțiuni de căutare și filtrare
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (searchName) params.name = searchName;
      if (filterType) params.type = filterType;
      if (filterSubType) params.sub_type = filterSubType;

      const res = await axios.get<InventoryItem[]>(
        import.meta.env.VITE_API_URL + '/api/inventory',
        { params }
      );
      setItems(res.data);
    } catch (err: any) {
      console.error('❌ Eroare la fetchItems:', err);
      setError('Eroare la încărcarea listei.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tipuri și subtips-uri
  const fetchTypes = async () => {
    try {
      const res = await axios.get<TypeItem[]>(
        import.meta.env.VITE_API_URL + '/api/types'
      );
      setTypes(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchTypes:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchTypes();
  }, [searchName, filterType, filterSubType]);

  // Adaugă item nou
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newQuantity < 0 || !newType || !newSubType) {
      alert('Completează corect toate câmpurile.');
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/inventory', {
        name: newName,
        quantity: newQuantity,
        type: newType,
        sub_type: newSubType,
      });
      setNewName('');
      setNewQuantity(0);
      setNewType('');
      setNewSubType('');
      fetchItems();
    } catch (err) {
      console.error('❌ Eroare la addInventory:', err);
      alert('Eroare la adăugare.');
    }
  };

  // Șterge item
  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest item?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/inventory/${id}`);
      fetchItems();
    } catch (err) {
      console.error('❌ Eroare la deleteInventory:', err);
      alert('Eroare la ștergere.');
    }
  };

  // Deschide popup de editare
  const openEditPopup = (item: InventoryItem) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditType(item.type);
    setEditSubType(item.sub_type);
    // Am eliminat referința la selectedTypeForEdit, deoarece nu era folosit
  };

  // Confirmă modificare quantity, type și sub_type
  const handleEditConfirm = async () => {
    if (!editingItem) return;
    if (!editType || !editSubType) {
      alert('Alege tip și subtip.');
      return;
    }
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/inventory/${editingItem._id}`,
        {
          name: editingItem.name,
          quantity: editQuantity,
          type: editType,
          sub_type: editSubType,
        }
      );
      setEditingItem(null);
      setFilterType(null);
      setFilterSubType(null);
      fetchItems();
    } catch (err) {
      console.error('❌ Eroare la updateInventory:', err);
      alert('Eroare la modificare.');
    }
  };

  // Render butoane de filtrare (type și sub_type)
  const renderFilterButtons = () => {
    // găsește array-ul de sub_types pentru filterType (sau [] dacă nu există)
    const currentSubs = types.find(t => t.name === filterType)?.sub_types || [];

    return (
      <div className={styles.filterContainer}>
        <div className={styles.typeButtons}>
          <button
            className={filterType === null ? styles.activeFilter : ''}
            onClick={() => {
              setFilterType(null);
              setFilterSubType(null);
            }}
          >
            All
          </button>

          {types.map(t => (
            <button
              key={t._id}
              className={filterType === t.name ? styles.activeFilter : ''}
              onClick={() => {
                if (filterType === t.name) {
                  setFilterType(null);
                  setFilterSubType(null);
                } else {
                  setFilterType(t.name);
                  setFilterSubType(null);
                }
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {filterType && (
          <>
            {/* afișează butoane de sub_tip doar dacă există un filterType */}
            <div className={styles.subTypeButtons}>
              <button
                className={filterSubType === null ? styles.activeFilter : ''}
                onClick={() => setFilterSubType(null)}
              >
                All
              </button>

              {currentSubs.map(st => (
                <button
                  key={st}
                  className={filterSubType === st ? styles.activeFilter : ''}
                  onClick={() => {
                    if (filterSubType === st) {
                      setFilterSubType(null);
                    } else {
                      setFilterSubType(st);
                    }
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.inventoryContainer}>
      <header className={styles.inventoryHeader}>
        <h1>
          <a href="/">← Back</a>
          <br />
          Inventory
        </h1>
      </header>

      <section className={styles.inventorySearch}>
        <input
          type="text"
          placeholder="Caută după nume..."
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <button onClick={() => setAddmenu(prev => !prev)}>Add</button>
      </section>

      {addmenu && (
        <section className={styles.inventoryAdd}>
          <h2>Adaugă item nou</h2>
          <form onSubmit={handleAdd} className={styles.addForm}>
            <input
              type="text"
              placeholder="Nume"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cantitate"
              value={newQuantity}
              onChange={e => setNewQuantity(parseFloat(e.target.value))}
              required
            />
            <select
              value={newType}
              onChange={e => {
                setNewType(e.target.value);
                setNewSubType(''); // resetează sub_type când se schimbă type
              }}
              required
            >
              <option value="">Alege tip</option>
              {types.map(t => (
                <option key={t._id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              value={newSubType}
              onChange={e => setNewSubType(e.target.value)}
              required
              disabled={!newType}
            >
              <option value="">Alege subtip</option>
              {(types.find(t => t.name === newType)?.sub_types || []).map(
                st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                )
              )}
            </select>
            <button type="submit">Adaugă</button>
          </form>
        </section>
      )}

      {renderFilterButtons()}

      <section className={styles.inventoryList}>
        {loading && <p>Se încarcă...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && items.length === 0 && <p>Nu există itemi.</p>}

        {items.map(item => (
          <div
            key={item._id}
            className={styles.inventoryItem}
            style={{ opacity: item.quantity === 0 ? 0.5 : 1 }}
          >
            <div className={styles.itemInfo}>
              <img
                src={`/images/${item.name.toLowerCase().replace(' ', '_')}.png`}
                alt="img"
                className={styles.itemInfo_img}
              />
              <span className={styles.itemInfo_name}>
                {item.name}
                <span className={styles.itemInfo_types}>
                  {item.type} | {item.sub_type}
                </span>
              </span>
            </div>
            <div className={styles.itemActions}>
              <div className={styles.itemActions_quantity}>{item.quantity}</div>
              <button onClick={() => openEditPopup(item)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20V17.575C3 17.3083 3.05 17.054 3.15 16.812C3.25 16.57 3.39167 16.3577 3.575 16.175L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7707 5.4 20.862 5.65C20.9533 5.9 20.9993 6.15 21 6.4C21 6.66667 20.954 6.921 20.862 7.163C20.77 7.405 20.6243 7.62567 20.425 7.825L7.825 20.425C7.64167 20.6083 7.429 20.75 7.187 20.85C6.945 20.95 6.691 21 6.425 21H4ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
                    fill="white"
                  />
                </svg>
              </button>
              <button onClick={() => handleDelete(item._id)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </section>

      {editingItem && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Modifică item: {editingItem.name}</h3>

            <div className={styles.editRow}>
              <label>Cantitate:</label>
              <div className={styles.quickButtons}>
                {quickQuantities.map(q => (
                  <button
                    key={q}
                    className={q === editQuantity ? styles.activeButton : ''}
                    onClick={() => setEditQuantity(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className={styles.customInput}>
                <input
                  type="number"
                  step="0.01"
                  value={editQuantity}
                  onChange={e => setEditQuantity(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.editRow}>
              <label>Tip:</label>
              <select
                value={editType}
                onChange={e => {
                  setEditType(e.target.value);
                  setEditSubType(''); // resetează când schimb tip
                }}
              >
                <option value="">Alege tip</option>
                {types.map(t => (
                  <option key={t._id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.editRow}>
              <label>Subtip:</label>
              <select
                value={editSubType}
                onChange={e => setEditSubType(e.target.value)}
                disabled={!editType}
              >
                <option value="">Alege subtip</option>
                {(types.find(t => t.name === editType)?.sub_types || []).map(
                  st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className={styles.popupButtons}>
              <button onClick={handleEditConfirm}>Salvează</button>
              <button onClick={() => setEditingItem(null)}>Anulează</button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.bottom}>
        <a href={'/cart'} className={styles.bottom_cart}>
          Cart
        </a>
        <a href={'/use'} className={styles.bottom_use}>
          Use
        </a>
      </div>
    </div>
  );
};

export default Inventory;
