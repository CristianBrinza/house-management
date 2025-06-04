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
  comment: string;
}

const Drunked: React.FC = () => {
  const [drunked, setDrunked] = useState<DrunkedDrink[]>([]);
  // Popup state pentru afișare comentariu
  const [viewing, setViewing] = useState<DrunkedDrink | null>(null);
  // Popup state pentru editare comentariu
  const [editing, setEditing] = useState<DrunkedDrink | null>(null);
  const [draftComment, setDraftComment] = useState('');

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

  // Deschide popup „View Comment”
  const openViewComment = (d: DrunkedDrink) => {
    if (!d.comment || d.comment.trim() === '') return;
    setViewing(d);
  };
  const closeViewComment = () => {
    setViewing(null);
  };

  // Deschide popup „Edit Comment”
  const openEditComment = (d: DrunkedDrink) => {
    setEditing(d);
    setDraftComment(d.comment || '');
  };
  const closeEditComment = () => {
    setEditing(null);
    setDraftComment('');
  };

  // Salvează comentariul editat
  const handleSaveComment = async () => {
    if (!editing) return;
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/drunk/${editing._id}/comment`,
        { comment: draftComment.trim() }
      );
      closeEditComment();
      fetchDrunked();
    } catch (err) {
      console.error('❌ Eroare la handleSaveComment:', err);
      alert('Eroare la salvare comentariu.');
    }
  };

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
                  {d.type} | {d.date} | MDL{d.price.toFixed(2)}
                  <br />
                  Consumed at: {new Date(d.consumedAt).toLocaleString()}
                </span>
              </div>

              <div className={styles.itemActions}>
                {/* Buton „View Comment” (doar dacă există comment) */}
                {d.comment && d.comment.trim() !== '' && (
                  <button style={{display: 'none'}}
                    className={styles.viewCommentButton}
                    onClick={() => openViewComment(d)}
                  >
                    View Comment
                  </button>
                )}

                {/* Buton „Edit Comment” */}
                <button
                  className={styles.editCommentButton}
                  onClick={() => openEditComment(d)}
                >
                   Comment
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Popup afișare comentariu (read-only) */}
      {viewing && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Comentariu pentru: {viewing.name}</h3>
            <p className={styles.commentText}>{viewing.comment}</p>
            <button onClick={closeViewComment}>Close</button>
          </div>
        </div>
      )}

      {/* Popup editare comentariu */}
      {editing && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            {/*<h3>Edit Comment pentru: {editing.name}</h3>*/}
            <textarea
              value={draftComment}
              onChange={e => setDraftComment(e.target.value)}
              rows={5}
              className={styles.commentTextarea}
            />
            <div className={styles.popupButtons}>
              <button onClick={handleSaveComment}>Save </button>
              <button onClick={closeEditComment}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drunked;
