import React from 'react';
import styles from '../../styles/scientificPois.module.css';

/**
 * Filter bar allowing categorization and selection of Scientific POIs
 */
export default function PoiFilterBar({
  categoryFilter,
  onChangeCategory,
  categories = [],
  totalCount = 0,
  filteredCount = 0
}) {
  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={styles.filterTitle}>Geological Category Filter:</span>
          <span className={styles.filterCountBadge}>
            Showing {filteredCount} of {totalCount} Sites
          </span>
        </div>
        <span className={styles.sourceNotice}>
          Source: USGS Astrogeology & NASA Planetary Data System
        </span>
      </div>

      <div className={styles.categoriesPillGroup}>
        <button
          type="button"
          className={`${styles.categoryPill} ${categoryFilter === 'ALL' ? styles.categoryPillActive : ''}`}
          onClick={() => onChangeCategory('ALL')}
        >
          All Geological Sites ({totalCount})
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.categoryPill} ${categoryFilter === cat ? styles.categoryPillActive : ''}`}
            onClick={() => onChangeCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
