import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../HomeScreen/Header';

import styles from './UpdatePage.module.css';

import reject from '../../assets/reject.png';
import closeIcon from '../../assets/closeIcon.png';

const UpdatePage = () => {
  const [token] = useCookies(['myToken']);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [citation, setCitation] = useState('');
//-----------------------------------
  let navigate = useNavigate();
  const { researchPaperId } = useParams();
//-----------------------------------
  const [errorMessage, setErrorMessage] = useState('');
  const [plagiarismScore, setPlagiarismScore] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch the research paper details and pre-fill the form
    const fetchResearchPaperDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/researchpapers/${researchPaperId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.myToken}`,
          },
        });

        const data = await response.json();
        setTitle(data.title);
        setTopic(data.Topic);
        setCitation(data.citation);
        setPlagiarismScore(data.score);
      } catch (error) {
        setErrorMessage('Failed to fetch research paper details. Please try again later.');
      }
    };

    fetchResearchPaperDetails();
  }, [researchPaperId, token.myToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const formDataPlg = new FormData();
      formDataPlg.append('file', file);

      // Check plagiarism using API
      const response = await fetch('http://127.0.0.1:8000/api/check-plagiarism/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.myToken}`,
        },
        body: formDataPlg,
      });

      const data = await response.json();
      setPlagiarismScore(data.score);
      setShowConfirmation(true);
    } catch (error) {
      setErrorMessage('Failed to check plagiarism. Please try again later.');
    }
  };

  const handleConfirmation = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('Topic', topic);
      formData.append('file', file);
      formData.append('citation', citation);
      formData.append('score', plagiarismScore);

      // Update the research paper
      await fetch(`http://127.0.0.1:8000/api/researchpapers/${researchPaperId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.myToken}`,
        },
        body: formData,
      });

      navigate('/home');
    } catch (error) {
      setErrorMessage('Failed to update research paper. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Update Research Paper</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="topic">Topic:</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="file">File:</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="citation">Citation:</label>
            <textarea
              id="citation"
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              required
            />
          </div>
          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton}>
              Check Plagiarism
            </button>
          </div>
        </form>
        {showConfirmation && (
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <img
                className={styles.closeIcon}
                src={closeIcon}
                alt="Close"
                onClick={() => setShowConfirmation(false)}
              />
            </div>
            <div className={styles.modalContent}>
              {plagiarismScore && (
                <p className={styles.score}>
                  Plagiarism Score: {plagiarismScore}%
                </p>
              )}
              {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
              )}
              {plagiarismScore && plagiarismScore <= 100 ? (
                <>
                  <p className={styles.question}>
                    Do you want to update the research paper?
                  </p>
                  <div className={styles.modalButtons}>
                    <button
                      onClick={handleConfirmation}
                      className={styles.confirmButton}
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <p className={styles.question}>
                    Due to high plagiarism, you cannot update this research paper.
                  </p>
                  <img className={styles.reject} src={reject} alt="" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePage;
