// src/pages/drink-types/DrinkTypes.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './DrinkTypes.module.css';

interface DrinkType {
  _id: string;
  name: string;
}

const DrinkTypes: React.FC = () => {
  const [types, setTypes] = useState<DrinkType[]>([]);
  const [newTypeName, setNewTypeName] = useState('');

  const [editing, setEditing] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Preia tipurile la montare și după orice modificare
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
    fetchTypes();
  }, []);

  // Crează tip nou
  const handleCreateType = async () => {
    if (!newTypeName.trim()) {
      alert('Denumire tip obligatorie.');
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/drink-types', {
        name: newTypeName.trim(),
      });
      setNewTypeName('');
      fetchTypes();
    } catch (err: any) {
      console.error('❌ Eroare la handleCreateType:', err);
      alert(err.response?.data?.error || 'Eroare la creare tip.');
    }
  };

  // Începe editarea tipului selectat
  const startEdit = (t: DrinkType) => {
    setEditing({ id: t._id, name: t.name });
  };

  // Salvează modificările
  const handleSaveEdit = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      alert('Denumire tip obligatorie.');
      return;
    }
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/drink-types/${editing.id}`,
        { name: editing.name.trim() }
      );
      setEditing(null);
      fetchTypes();
    } catch (err: any) {
      console.error('❌ Eroare la handleSaveEdit:', err);
      alert(err.response?.data?.error || 'Eroare la salvare modificări.');
    }
  };

  // Șterge tip
  const handleDeleteType = async (id: string) => {
    if (!confirm('Ștergi acest tip?')) return;
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL + `/api/drink-types/${id}`
      );
      fetchTypes();
    } catch (err) {
      console.error('❌ Eroare la handleDeleteType:', err);
      alert('Eroare la ștergere tip.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <a href="/config">← Back</a>
          <br />
          Manage Drink Types
        </h1>
      </header>

      <section className={styles.createSection}>
        <input
          type="text"
          placeholder="Denumire tip nou"
          value={newTypeName}
          onChange={e => setNewTypeName(e.target.value)}
        />
        <button onClick={handleCreateType}>Add Type</button>
      </section>

      <section className={styles.typesList}>
        {types.length === 0 && <p>Nu există tipuri definite.</p>}
        {types.map(t => (
          <div key={t._id} className={styles.typeItem}>
            {editing && editing.id === t._id ? (
              <>
                <input
                  type="text"
                  value={editing.name}
                  onChange={e =>
                    setEditing(prev =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span className={styles.typeName}>{t.name}</span>
                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => handleDeleteType(t._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default DrinkTypes;
