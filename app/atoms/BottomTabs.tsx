import React, { FC, Suspense } from 'react';
import styles from './BottomTabs.css';
import { Spinner } from './Spinner';

const TAB_ID_PREFIX = 'bottom-tab-';
const LABEL_ID_PREFIX = 'bottom-tab-label-';

export const BottomTabs: FC<{
  selectedTabId: string;
  onTabClick: (tabId: string) => void;
  tabs: Array<{
    tabId: string;
    label: string;
    Icon: FC;
    Content: FC;
  }>;
}> = ({ selectedTabId, onTabClick, tabs }) => (
  <div className={styles.wrapper}>
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          className={styles.tab}
          key={tab.tabId}
          type="button"
          role="tab"
          aria-selected={tab.tabId === selectedTabId}
          aria-controls={`${TAB_ID_PREFIX}${tab.tabId}`}
          onClick={() => onTabClick(tab.tabId)}
        >
          <span className={styles.tabIcon}>
            <tab.Icon />
          </span>
          <span
            className={styles.tabLabel}
            id={`${LABEL_ID_PREFIX}${tab.tabId}`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>

    <div className={styles.content}>
      {tabs.map((tab) =>
        tab.tabId === selectedTabId ? (
          <div
            key={tab.tabId}
            className={styles.tabContent}
            tabIndex={0}
            role="tabpanel"
            id={`${TAB_ID_PREFIX}${tab.tabId}`}
            aria-labelledby={`${LABEL_ID_PREFIX}${tab.tabId}`}
          >
            <Suspense
              fallback={
                <div className={styles.tabSpinner}>
                  <Spinner size="large" />
                </div>
              }
            >
              <tab.Content />
            </Suspense>
          </div>
        ) : null,
      )}
    </div>
  </div>
);
