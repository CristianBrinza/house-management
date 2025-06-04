import styles from './Config.module.css';
export default function Config() {
  return (
    <>
      <header className={styles.header}>
        <h1>
          <a href="/">← Back</a>
        </h1>
        {/*<span>Logged in as: {user?.username}</span>*/}
      </header>
      <div className={styles.home}>
        <a className={styles.home_btn} href="/types">
          Inventory Types
        </a>
        <a className={styles.home_btn} href="/drink-types">
          Drink Types
        </a>
      </div>
    </>
  );
}
