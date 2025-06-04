import styles from './Home.module.css';
export default function Home() {
  return (
    <div className={styles.home}>
      <a className={styles.home_btn} href="/inventory">
        Inventory
      </a>
      <a className={styles.home_btn} href="/config">
        Config
      </a>
    </div>
  );
}
