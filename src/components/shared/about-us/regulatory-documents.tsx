import React from 'react';

import styles from '@/css/about-us/regulatory-documents.module.css';

import { Container } from '../container';

const documentsData = [
  { 
    id: 1, 
    title: 'Положення про студентське самоврядування', 
    url: '#' 
  }
  // Add more documents here as needed
];

export const RegulatoryDocuments: React.FC = () => {
  return (
    <Container>
      <div className={styles.wrapper}>
        
        <div className={styles.titleContainer}>
          <h1 className={styles.aboutTitle}>НОРМАТИВНІ</h1>
          <h1 className={styles.aboutTitle}>ДОКУМЕНТИ</h1>
        </div>

        <div className={styles.documentsList}>
          {documentsData.map((doc) => (
            <a key={doc.id} href={doc.url} className={styles.documentLink}>
              <svg 
                className={styles.icon} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className={styles.documentText}>{doc.title}</span>
            </a>
          ))}
        </div>
        
      </div>
    </Container>
  );
};