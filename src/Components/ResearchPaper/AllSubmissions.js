import React, { useState, useEffect } from 'react';
import styles from './AllSubmissions.module.css';
import { useCookies } from 'react-cookie';
import { Document, Page, pdfjs } from 'react-pdf';
import { Link } from 'react-router-dom';
import Header from '../HomeScreen/Header';
import Footer from '../HomeScreen/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AllSubmissions = () => {
  const [token] = useCookies(['myToken']);
  const [researchPapers, setResearchPapers] = useState([]);
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/all-research-papers/", {
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
              file: new URL(paper.file, 'http://127.0.0.1:8000'),
              authorName: authorData.full_name,
              country: authorData.country,
              comments: commentData.comments
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

  const handleInputChange = (e, researchID) => {
    const { value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [researchID]: value,
    }));
  };

  const handleSubmitComment = async (e, researchID) => {
    e.preventDefault();
    const comment = inputs[researchID];

    try {
      const response = await fetch('http://127.0.0.1:8000/api/add-comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.myToken}`,
        },
        body: JSON.stringify({
          research_paper: researchID,
          comment: comment,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      setInputs((prevState) => ({
        ...prevState,
        [researchID]: '',
      }));


    } catch (error) {
      console.error('Error submitting comment:', error);
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
                        <p className={styles['card-status']}>{researchPaper.status}</p>
                        <h5 className={styles['card-title']}>{researchPaper.title}</h5>
                        <p className={styles['card-text']}>Topic: {researchPaper.Topic}</p>
                        <p className={styles['card-date']}>{researchPaper.publication_date}</p>
                        <p className={styles['card-author']}>Author: {researchPaper.authorName} ({researchPaper.country})</p>
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
                       View Research-Paper
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
                    
                    {token['myToken'] && (
                      <div className={styles['comment-button']}>
                      <form className={styles['form']}>
                        <input type="hidden" name="research-id" required value={researchPaper.id} />
                        <input
                          type="text"
                          name="comment"
                          placeholder="Share Your Views ..."
                          required
                          value={inputs[researchPaper.id] || ''}
                          onChange={(e) => handleInputChange(e, researchPaper.id)}
                          className={styles['form-input']}
                        />
                        <button
                          type="button"
                          style={{ textDecoration: 'none', background: 'none', width: 'fit-content' }}
                          onClick={(e) => handleSubmitComment(e, researchPaper.id)}
                        >
                          <div className={styles.iconContainer}>
                            <FontAwesomeIcon icon={faComments} size="lg" className={styles.icon} />
                          </div>
                        </button>
                      </form>

                      </div>
                    )}
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

export default AllSubmissions;
