// src/pages/type-management/TypeManagement.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
import styles from './TypeManagement.module.css';

interface TypeItem {
  _id: string;
  name: string;
  sub_types: string[];
}

const TypeManagement: React.FC = () => {
  // const { user } = useAuth();

  const [types, setTypes] = useState<TypeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stări pentru noul tip
  const [newTypeName, setNewTypeName] = useState('');

  // Map pentru editarea tipurilor:
  const [editedTypeNames, setEditedTypeNames] = useState<
    Record<string, string>
  >({});
  // Map pentru adăugat subtip la fiecare tip
  const [newSubTypeNames, setNewSubTypeNames] = useState<
    Record<string, string>
  >({});
  // Map pentru schimbat numele unui subtip existent
  const [editedSubTypes, setEditedSubTypes] = useState<
    Record<string, Record<string, string>>
  >({});
  //   structura: { typeId: { oldSubName: newSubName, ... }, ... }

  // Erori locale
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch all types
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get<TypeItem[]>(
        import.meta.env.VITE_API_URL + '/api/types'
      );
      setTypes(res.data);
    } catch (err) {
      console.error('❌ Eroare la fetchTypes în TypeManagement:', err);
      setError('Eroare la încărcarea tipurilor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Creează un tip nou
  const handleCreateType = async () => {
    if (!newTypeName.trim()) {
      setLocalError('Numele tipului nu poate fi gol.');
      return;
    }
    setLocalError(null);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/types', {
        name: newTypeName.trim(),
      });
      setNewTypeName('');
      fetchTypes();
    } catch (err: any) {
      console.error('❌ Eroare la handleCreateType:', err);
      setLocalError(err.response?.data?.error || 'Eroare la creare tip.');
    }
  };

  // Șterge un tip
  const handleDeleteType = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest tip?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/types/${id}`);
      fetchTypes();
    } catch (err) {
      console.error('❌ Eroare la handleDeleteType:', err);
      alert('Eroare la ștergere tip.');
    }
  };

  // Salvează (update) numele unui tip
  const handleUpdateType = async (id: string) => {
    const newName = editedTypeNames[id]?.trim();
    if (!newName) {
      setLocalError('Numele tipului nu poate fi gol.');
      return;
    }
    setLocalError(null);
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/api/types/${id}`, {
        name: newName,
      });
      fetchTypes();
    } catch (err: any) {
      console.error('❌ Eroare la handleUpdateType:', err);
      setLocalError(err.response?.data?.error || 'Eroare la actualizare tip.');
    }
  };

  // Adaugă un subtip la un tip
  const handleAddSubType = async (typeId: string) => {
    const subName = newSubTypeNames[typeId]?.trim();
    if (!subName) {
      setLocalError('Numele subtipului nu poate fi gol.');
      return;
    }
    setLocalError(null);
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + `/api/types/${typeId}/subtypes`,
        { name: subName }
      );
      setNewSubTypeNames(prev => ({ ...prev, [typeId]: '' }));
      fetchTypes();
    } catch (err: any) {
      console.error('❌ Eroare la handleAddSubType:', err);
      setLocalError(err.response?.data?.error || 'Eroare la adăugare subtip.');
    }
  };

  // Redenumește un subtip
  const handleRenameSubType = async (typeId: string, oldSubName: string) => {
    const newName = editedSubTypes[typeId]?.[oldSubName]?.trim();
    if (!newName) {
      setLocalError('Noul nume de subtip nu poate fi gol.');
      return;
    }
    setLocalError(null);
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/types/${typeId}/subtypes`,
        {
          oldName: oldSubName,
          newName: newName,
        }
      );
      fetchTypes();
    } catch (err: any) {
      console.error('❌ Eroare la handleRenameSubType:', err);
      setLocalError(
        err.response?.data?.error || 'Eroare la redenumire subtip.'
      );
    }
  };

  // Șterge un subtip
  const handleDeleteSubType = async (typeId: string, subName: string) => {
    if (!confirm(`Ștergi subtipul "${subName}"?`)) return;
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL + `/api/types/${typeId}/subtypes`,
        { data: { name: subName } }
      );
      fetchTypes();
    } catch (err) {
      console.error('❌ Eroare la handleDeleteSubType:', err);
      alert('Eroare la ștergere subtip.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          {' '}
          <a href="/config">← Back</a>
          <br />
          Type Management
        </h1>
        {/*<span>Logged in as: {user?.username}</span>*/}
      </header>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {localError && <p className={styles.errorMessage}>{localError}</p>}

      <section className={styles.createTypeSection}>
        <h2>Adaugă Tip Nou</h2>
        <div className={styles.createTypeForm}>
          <input
            type="text"
            placeholder="Nume Tip"
            value={newTypeName}
            onChange={e => setNewTypeName(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleCreateType} className={styles.button}>
            Creează Tip
          </button>
        </div>
      </section>

      <section className={styles.listSection}>
        <h2>Lista Tipurilor</h2>
        {loading && <p>Se încarcă...</p>}
        {!loading && types.length === 0 && <p>Nu există tipuri.</p>}

        {!loading &&
          types.map(t => (
            <div key={t._id} className={styles.typeCard}>
              <div className={styles.typeHeader}>
                <input
                  type="text"
                  value={editedTypeNames[t._id] ?? t.name}
                  onChange={e =>
                    setEditedTypeNames(prev => ({
                      ...prev,
                      [t._id]: e.target.value,
                    }))
                  }
                  className={styles.inputSmall}
                />
                <button
                  onClick={() => handleUpdateType(t._id)}
                  className={styles.buttonSmall}
                >
                  Salvează Tip
                </button>
                <button
                  onClick={() => handleDeleteType(t._id)}
                  className={styles.buttonDelete}
                >
                  Șterge Tip
                </button>
              </div>

              <div className={styles.subtypesSection}>
                <h4>Subtipuri pentru "{t.name}"</h4>
                {t.sub_types.length === 0 && <p>(Niciun subtip)</p>}

                {t.sub_types.map(st => (
                  <div key={st} className={styles.subtypeRow}>
                    <input
                      type="text"
                      value={editedSubTypes[t._id]?.[st] ?? st}
                      onChange={e => {
                        const newVal = e.target.value;
                        setEditedSubTypes(prev => ({
                          ...prev,
                          [t._id]: {
                            ...((prev[t._id] as Record<string, string>) ?? {}),
                            [st]: newVal,
                          },
                        }));
                      }}
                      className={styles.inputSmall}
                    />
                    <button
                      onClick={() => handleRenameSubType(t._id, st)}
                      className={styles.buttonSmall}
                    >
                      Salvează Subtip
                    </button>
                    <button
                      onClick={() => handleDeleteSubType(t._id, st)}
                      className={styles.buttonDelete}
                    >
                      Șterge Subtip
                    </button>
                  </div>
                ))}

                <div className={styles.addSubtypeRow}>
                  <input
                    type="text"
                    placeholder="Nume Subtip Nou"
                    value={newSubTypeNames[t._id] ?? ''}
                    onChange={e =>
                      setNewSubTypeNames(prev => ({
                        ...prev,
                        [t._id]: e.target.value,
                      }))
                    }
                    className={styles.inputSmall}
                  />
                  <button
                    onClick={() => handleAddSubType(t._id)}
                    className={styles.buttonSmall}
                  >
                    Adaugă Subtip
                  </button>
                </div>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default TypeManagement;
