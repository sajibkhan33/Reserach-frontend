import React, { useState, useEffect } from 'react';
import styles from './PapersToReview.module.css';
import { useCookies } from 'react-cookie';
import { Document, Page, pdfjs } from 'react-pdf';
import { Link } from 'react-router-dom';
import Header from '../HomeScreen/Header';
import Footer from '../HomeScreen/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPause } from '@fortawesome/free-solid-svg-icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PapersToReview = () => {
  const [token] = useCookies(['myToken']);
  const [researchPapers, setResearchPapers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/review-research-data/", {
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

        const researchPapersWithAuthorData = await Promise.all(
          data.research_papers.map(async (paper) => {
            const authorResponse = await fetch(`http://127.0.0.1:8000/api/author-info/${paper.author}/`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
            if (!authorResponse.ok) {
              throw new Error('Failed to fetch author data');
            }
            const authorData = await authorResponse.json();
            return {
              ...paper,
              file: new URL(paper.file, 'http://127.0.0.1:8000'),
              authorName: authorData.full_name,
              country: authorData.country,
            };
          })
        );

        setResearchPapers(researchPapersWithAuthorData);
        console.log(researchPapersWithAuthorData);
      } catch (error) {
        setError('Error fetching research papers');
        console.error('Error fetching research papers:', error);
      }
    };

    fetchResearchPapers();
  }, []);

  const markAsReviewed = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/researchpapers/${id}/mark_as_reviewed/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.myToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark research paper as reviewed');
      }
      // Update the research paper status locally
      setResearchPapers((prevPapers) =>
        prevPapers.map((paper) => (paper.id === id ? { ...paper, status: 'reviewed' } : paper))
      );
    } catch (error) {
      console.error('Error marking research paper as reviewed:', error);
    }
  };

  const markAsPending = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/researchpapers/${id}/mark_as_pending/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.myToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark research paper as reviewed');
      }
      // Update the research paper status locally
      setResearchPapers((prevPapers) =>
        prevPapers.map((paper) => (paper.id === id ? { ...paper, status: 'pending' } : paper))
      );
    } catch (error) {
      console.error('Error marking research paper as reviewed:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.row}>
            {error && <p className={styles['error-message']}>{error}</p>}
            {researchPapers.map((researchPaper) => (
              <div className={styles['col-md-4']} key={researchPaper.id}>
                <div className={styles.card}>
                  <div className={styles['card-body']}>
                    <div className={styles['card-head']}>
                      <p className={styles['card-date']}>{researchPaper.status}</p>
                      <h5 className={styles['card-title']}>Title: {researchPaper.title}</h5>
                      <p className={styles['card-text']}>Topic: {researchPaper.Topic}</p>
                      <p className={styles['card-author']}>
                        Author: {researchPaper.authorName} ({researchPaper.country})
                      </p>
                      <p className={styles['card-author']}>{researchPaper.publication_date}</p>
                    </div>
                    <div className={styles['pdf-preview']}>
                      <Document file={researchPaper.file.toString()}>
                        <Page pageNumber={1} width={350} height={400} renderTextLayer={false} />
                      </Document>
                    </div>
                    <div className={styles['view-pdf-button']}>
                      <Link
                        to={researchPaper.file.toString()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', fontWeight: 'bold', color: 'white', width: '100%' }}
                        className={styles['link-view']}
                      >
                        View Research Paper
                      </Link>
                      <button
                        onClick={() => markAsPending(researchPaper.id)}
                        style={{ textDecoration: 'none', color: 'white', width: '100%' }}
                        className={styles['link-comments']}
                      >
                        <FontAwesomeIcon icon={faPause} size="md" className={styles.icon} />
                        {' '}
                        Pending
                      </button>
                      <button
                        onClick={() => markAsReviewed(researchPaper.id)}
                        style={{ textDecoration: 'none', color: 'white', width: '100%' }}
                        className={styles['link-comments']}
                      >
                        <FontAwesomeIcon icon={faCheck} size="md" className={styles.icon} />
                        {' '}
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PapersToReview;
