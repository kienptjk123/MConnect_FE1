// components/loading/RubiksLoading.tsx
import styles from "./RubiksLoading.module.css";

export default function RubiksLoading() {
  return (
    <div className="h-screen flex">
      <div className={styles.myLoader}>
        <div className={styles.rubiksCube}>
          <div className={`${styles.face} ${styles.front}`}>
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
          </div>

          <div className={`${styles.face} ${styles.back}`}>
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
          </div>

          <div className={`${styles.face} ${styles.left}`}>
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
          </div>

          <div className={`${styles.face} ${styles.right}`}>
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
          </div>

          <div className={`${styles.face} ${styles.top}`}>
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
          </div>

          <div className={`${styles.face} ${styles.bottom}`}>
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
            <div style={{ background: "#ffeb3b" }} className={styles.cube} />
            <div style={{ background: "#4caf50" }} className={styles.cube} />
            <div style={{ background: "#2196f3" }} className={styles.cube} />
            <div style={{ background: "#ffffff" }} className={styles.cube} />
            <div style={{ background: "#ff3d00" }} className={styles.cube} />
          </div>
        </div>
      </div>
    </div>
  );
}
