import React, { useState, useEffect } from 'react';
import styles from './MyRepo.module.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import Header from '../HomeScreen/Header';
import Footer from '../HomeScreen/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenFancy, faComments } from '@fortawesome/free-solid-svg-icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MyRepo = () => {
  const [researchPapers, setResearchPapers] = useState([]);
  const [error, setError] = useState('');
  const [token] = useCookies(['myToken']);

  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/my-research-data/', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.myToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch research papers');
        }
        const data = await response.json();

       
        const researchPapersWithUrls =  await Promise.all(
          data.research_papers.map(async (paper) => {
            const commentResponse = await fetch(`http://127.0.0.1:8000/api/comment-count/${paper.id}/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
            
          const commentData = await commentResponse.json();
          return {
            ...paper,
            file: `http://127.0.0.1:8000${paper.file}`, 
            comments: commentData.comments
          };
        })
        );

        setResearchPapers(researchPapersWithUrls);
        console.log(researchPapersWithUrls);
      } catch (error) {
        setError('Error fetching research papers');
        console.error('Error fetching research papers:', error);
      }
    };

    fetchResearchPapers();
  }, [token.myToken]);

  return (
    <div>
      <Header/>
        <div className={styles.section}>
            <div className={styles.container}>
                <div className={styles.row}>
                {error && <p className={styles['error-message']}>{error}</p>}
                {researchPapers.map((researchPaper) => (
                  <div className={styles['col-md-4']} key={researchPaper.id}>
                    <div className={styles.card}>
                      <div className={styles['card-body']}>
                        <p className={styles['card-status']}>{researchPaper.status}</p>
                        <h5 className={styles['card-title']}>{researchPaper.title}</h5>
                        <p className={styles['card-text']}>Topic: {researchPaper.Topic}</p>
                        <p className={styles['card-date']}>{researchPaper.publication_date}</p>
                        <div className={styles['pdf-preview']}>
                          <Document file={researchPaper.file}>
                            <Page pageNumber={1} width={350} height={400} renderTextLayer={false} />
                          </Document>
                        </div>
                            <div className={styles['view-pdf-button']}>
                              <Link
                                to={researchPaper.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', fontWeight: 'bold', color: 'white', width: '100%' }}
                                className={styles['link-view']}
                              >
                              View Research-Paper
                              </Link>
                              <Link
                                to={`/update/${researchPaper.id}/`}
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'white', width: '100%', }}
                                className={styles['link-comments']}
                              >
                                <FontAwesomeIcon icon={faPenFancy} size="md" className={styles.icon} />
                                {'  '} Edit
                              </Link>
                              <Link
                                to={`/comments/${researchPaper.id}/`}
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'white', width: '100%', }}
                                className={styles['link-comments']}
                              >
                                <FontAwesomeIcon icon={faComments} size="md" className={styles.icon} />
                                {' '}( {researchPaper.comments} )
                              </Link>
                            </div>
                        
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            </div>
        </div>
      <Footer/>
    </div>
  );
};

export default MyRepo;
