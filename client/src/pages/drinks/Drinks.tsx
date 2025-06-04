// src/pages/drinks/Drinks.tsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import styles from './Drinks.module.css';

interface Drink {
  _id: string;
  name: string;
  type: string;
  date: string; // format "YYYY-MM"
  price: number;
  comment: string;
}

interface DrinkType {
  _id: string;
  name: string;
}

const Drinks: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [types, setTypes] = useState<DrinkType[]>([]);
  const [addMenu, setAddMenu] = useState(false);

  // State pentru formularul de adăugare/editare
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');
  const [newDate, setNewDate] = useState(''); // format "YYYY-MM"
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newComment, setNewComment] = useState(''); // RO: comment pentru edit/creare

  // State pentru căutare și filtrare
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  // State pentru editare
  const [editing, setEditing] = useState<Drink | null>(null);

  // State pentru popup comentariu
  const [commentingDrink, setCommentingDrink] = useState<Drink | null>(null);
  const [draftComment, setDraftComment] = useState('');

  // Preia colecția de băuturi
  const fetchDrinks = async () => {
    try {
      const params: any = {};
      if (searchName) params.name = searchName;
      if (filterType) params.type = filterType;
      const res = await axios.get<Drink[]>(
        import.meta.env.VITE_API_URL + '/api/drinks',
        { params }
      );
      setDrinks(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchDrinks:', err);
    }
  };

  // Preia listele de tipuri (doar numele)
  const fetchTypes = async () => {
    try {
      const res = await axios.get<DrinkType[]>(
        import.meta.env.VITE_API_URL + '/api/drink-types'
      );
      setTypes(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchTypes:', err);
    }
  };

  useEffect(() => {
    fetchDrinks();
    fetchTypes();
  }, [searchName, filterType]);

  // Adaugă o băutură nouă
  const handleAddDrink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newType || !newDate || newPrice < 0) {
      alert('Completează toate câmpurile corect.');
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/drinks', {
        name: newName.trim(),
        type: newType,
        date: newDate,
        price: newPrice,
        comment: newComment.trim(),
      });
      setNewName('');
      setNewType('');
      setNewDate('');
      setNewPrice(0);
      setNewComment('');
      setAddMenu(false);
      fetchDrinks();
    } catch (err) {
      console.error('❌ Eroare la handleAddDrink:', err);
      alert('Eroare la adăugare băutură.');
    }
  };

  // Șterge o băutură
  const handleDeleteDrink = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această băutură?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/drinks/${id}`);
      fetchDrinks();
    } catch (err) {
      console.error('❌ Eroare la handleDeleteDrink:', err);
      alert('Eroare la ștergere băutură.');
    }
  };

  // Pornește editare
  const startEdit = (d: Drink) => {
    setEditing(d);
    setNewName(d.name);
    setNewType(d.type);
    setNewDate(d.date);
    setNewPrice(d.price);
    setNewComment(d.comment || '');
    setAddMenu(true);
  };

  // Salvează modificările (edit)
  const handleSaveEdit = async () => {
    if (!editing) return;
    if (!newName || !newType || !newDate || newPrice < 0) {
      alert('Completează toate câmpurile corect.');
      return;
    }
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/drinks/${editing._id}`,
        {
          name: newName.trim(),
          type: newType,
          date: newDate,
          price: newPrice,
          comment: newComment.trim(),
        }
      );
      setEditing(null);
      setAddMenu(false);
      setNewName('');
      setNewType('');
      setNewDate('');
      setNewPrice(0);
      setNewComment('');
      fetchDrinks();
    } catch (err) {
      console.error('❌ Eroare la handleSaveEdit:', err);
      alert('Eroare la salvare modificări.');
    }
  };

  // Marchez băutura ca „drunked”
  const handleConsume = async (id: string, name: string) => {
    if (!confirm(`Ești sigur(ă) că ai consumat “${name}”?`)) return;
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/api/drunk/${id}`);
      fetchDrinks();
    } catch (err) {
      console.error('❌ Eroare la handleConsume:', err);
      alert('Eroare la marcarea como „drunked”.');
    }
  };

  // Deschide popup pentru comentariu
  const openCommentPopup = (d: Drink) => {
    setCommentingDrink(d);
    setDraftComment(d.comment || '');
  };

  // Închide popup comentariu
  const closeCommentPopup = () => {
    setCommentingDrink(null);
    setDraftComment('');
  };

  // Salvează comentariul curent (pentru băutura din popup)
  const handleSaveComment = async () => {
    if (!commentingDrink) return;
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/drinks/${commentingDrink._id}`,
        {
          // Trimitem doar câmpul comment (put poate actualiza și celelalte, dar nu schimbăm)
          comment: draftComment.trim(),
        }
      );
      closeCommentPopup();
      fetchDrinks();
    } catch (err) {
      console.error('❌ Eroare la handleSaveComment:', err);
      alert('Eroare la salvare comentariu.');
    }
  };

  // Butoane de filtrare după tip
  const renderFilterButtons = () => (
    <div className={styles.filterContainer}>
      <div className={styles.typeButtons}>
        <button
          className={filterType === null ? styles.activeFilter : ''}
          onClick={() => setFilterType(null)}
        >
          All
        </button>
        {types.map(t => (
          <button
            key={t._id}
            className={filterType === t.name ? styles.activeFilter : ''}
            onClick={() =>
              setFilterType(prev => (prev === t.name ? null : t.name))
            }
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );

  // Filtrare locală (deja implementată în fetchDrinks)
  const filteredDrinks = useMemo(() => {
    return drinks;
  }, [drinks]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <a href="/">← Back</a>
          <br />
          Manage Drinks
        </h1>
        <a href={'/drunked'} className={styles.userLabel}>
          drunked
        </a>
      </header>

      <section className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={() => fetchDrinks()}>Search</button>
        <button
          onClick={() => {
            setAddMenu(prev => !prev);
            setEditing(null);
            setNewName('');
            setNewType('');
            setNewDate('');
            setNewPrice(0);
            setNewComment('');
          }}
        >
          {addMenu ? 'Close Form' : 'Add Drink'}
        </button>
      </section>

      {renderFilterButtons()}

      {addMenu && (
        <section className={styles.addSection}>
          <h2>{editing ? 'Edit Drink' : 'Add New Drink'}</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              editing ? handleSaveEdit() : handleAddDrink(e);
            }}
            className={styles.addForm}
          >
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />

            <select
              value={newType}
              onChange={e => setNewType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              {types.map(t => (
                <option key={t._id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="month"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              required
            />

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Price"
              value={newPrice}
              onChange={e => setNewPrice(parseFloat(e.target.value) || 0)}
              required
            />

            <textarea
              placeholder="Add a comment (3–5 sentences+)"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={4}
              className={styles.commentTextarea}
            />

            <button type="submit">{editing ? 'Save' : 'Add'}</button>
          </form>
        </section>
      )}

      <section className={styles.listSection}>
        {filteredDrinks.length === 0 ? (
          <p>No drinks found.</p>
        ) : (
          filteredDrinks.map(d => (
            <div key={d._id} className={styles.drinkItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{d.name}</span>
                <span className={styles.itemMeta}>
                  {d.type} <br />{' '}
                  <span className={styles.drink_small}>
                    MDL{d.price.toFixed(2)} | {d.date}
                  </span>
                </span>
                {/*{d.comment && (*/}
                {/*  <span className={styles.itemCommentPreview}>*/}
                {/*    "{d.comment.length > 50*/}
                {/*    ? d.comment.slice(0, 47) + '...'*/}
                {/*    : d.comment}"*/}
                {/*  </span>*/}
                {/*)}*/}
              </div>

              <div className={styles.itemActions}>
                <button onClick={() => startEdit(d)}>
                  {/* Iconiță Edit */}
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

                <button onClick={() => handleDeleteDrink(d._id)}>
                  {/* Iconiță Delete */}
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

                <button onClick={() => handleConsume(d._id, d.name)}>
                  {/* Iconiță „Consume” */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.42 2C10.9183 2.00002 10.435 2.18859 10.0658 2.5283C9.69665 2.86801 9.46864 3.33405 9.427 3.834L9.044 8.436L7.336 9.574C6.92507 9.84793 6.58812 10.2191 6.35506 10.6545C6.122 11.0899 6.00004 11.5761 6 12.07V19C6 19.7956 6.31607 20.5587 6.87868 21.1213C7.44129 21.6839 8.20435 22 9 22H15C15.7956 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7956 18 19V12.07C18 11.5761 17.878 11.0899 17.6449 10.6545C17.4119 10.2191 17.0749 9.84793 16.664 9.574L14.956 8.436L14.573 3.834C14.5314 3.33405 14.3034 2.86801 13.9342 2.5283C13.565 2.18859 13.0817 2.00002 12.58 2H11.42ZM16 14H12C11.7348 14 11.4804 14.1054 11.2929 14.2929C11.1054 14.4804 11 14.7348 11 15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8946 11.7348 16 12 16H16V19C16 19.2652 15.8946 19.5196 15.7071 19.7071C15.5196 19.8946 15.2652 20 15 20H9C8.73478 20 8.48043 19.8946 8.29289 19.7071C8.10536 19.5196 8 19.2652 8 19V12.07C7.99998 11.9054 8.04058 11.7434 8.11821 11.5982C8.19583 11.4531 8.30808 11.3293 8.445 11.238L10.153 10.1C10.4036 9.93298 10.6133 9.71152 10.7664 9.45213C10.9194 9.19275 11.012 8.90214 11.037 8.602L11.42 4H12.58L12.963 8.602C12.988 8.90214 13.0806 9.19275 13.2336 9.45213C13.3867 9.71152 13.5964 9.93298 13.847 10.1L15.555 11.238C15.6919 11.3293 15.8042 11.4531 15.8818 11.5982C15.9594 11.7434 16 11.9054 16 12.07V14Z"
                      fill="white"
                    />
                  </svg>
                </button>

                <button onClick={() => openCommentPopup(d)}>
                  {/* Iconiță „Comment” */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M3 12H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Popup Comentariu */}
      {commentingDrink && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            {/*<h3>Comentariu pentru: {commentingDrink.name}</h3>*/}
            <textarea
              value={draftComment}
              onChange={e => setDraftComment(e.target.value)}
              className={styles.commentTextarea}
            />
            <div className={styles.popupButtons}>
              <button onClick={handleSaveComment}>Save</button>
              <button onClick={closeCommentPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drinks;
