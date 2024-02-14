import React, { useState, useEffect } from 'react';
import styles from './CommentsPage.module.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../HomeScreen/Header';
import Footer from '../HomeScreen/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CommentsPage = () => {
  const { researchPaperId } = useParams();
  const [comments, setComments] = useState([]);
  const [researchPaper, setResearchPaper] = useState(null);
  const [token] = useCookies(['myToken']);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/comments/${researchPaperId}/`);
        const data = await response.json();
        setComments(data.comments);
        setResearchPaper(data.research_paper);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [researchPaperId, comments]);

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
    <div className={styles.container}>
      <Header />
      <div className={styles.commentsContainer}>
        <div className={styles.researchPaperCard}>
          {researchPaper && (
            <div>
            <div className={styles.card}>
              <div className={styles['card-body']}>
                <h5 className={styles['card-title']}>{researchPaper.title}</h5>
                <p className={styles['card-text']}>Topic: {researchPaper.Topic}</p>
                <p className={styles['card-date']}>{new Date(researchPaper.publication_date).toLocaleString()}</p>
                <div className={styles['pdf-preview']}>
                    <Document file={`http://127.0.0.1:8000${researchPaper.file}`}>
                    <Page pageNumber={1} width={500} height={400} renderTextLayer={false} />
                    </Document>
                </div>
                    <div className={styles['view-pdf-button']}>
                      <Link
                        to={`http://127.0.0.1:8000${researchPaper.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', fontWeight: 'bold', color: 'white', width: '100%' }}
                        className={styles['link-view']}
                      >
                       View Research-Paper
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
          )}
        </div>
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comments</h2>
          {comments.length === 0 ? (
            <p>No comments found.</p>
          ) : (
            <ul className={styles.commentsList}>
              {comments.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                  <p className={styles.commentAuthor}>{comment.author}</p>
                  <p className={styles.commentText}>{comment.comment}</p>
                  <p className={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
