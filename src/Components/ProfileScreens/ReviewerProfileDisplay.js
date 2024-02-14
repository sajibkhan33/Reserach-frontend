import React, { useEffect, useState } from 'react';
import styles from './ReviewerProfileDisplay.module.css';
import { useCookies } from 'react-cookie';
import Header from '../HomeScreen/Header';
import Footer from '../HomeScreen/Footer';

const ReviewerProfileDisplay = () => {
  const [profileData, setProfileData] = useState(null);
  const [token] = useCookies(['myToken']);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/reviewer-profiles/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.myToken}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          console.log('start');
          console.log(profileData);
          console.log('end');
          setProfileData(profileData[0]);
          console.log(profileData[0]);

        } else {
          console.log('Failed to fetch profile');
        }
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
        <Header/>
    
    <div className={styles.profile}>
      <h2>Profile</h2>
      <hr/>
      {profileData ? (
        <div className={styles.profileInfo}>
          <div className={styles.field}>
            <span className={styles.label}>Full Name:</span>
            <span className={styles.value}>{profileData.full_name}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gender:</span>
            <span className={styles.value}>{profileData.gender}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Phone Number:</span>
            <span className={styles.value}>{profileData.phone_number}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Institute:</span>
            <span className={styles.value}>{profileData.institute}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Address:</span>
            <span className={styles.value}>{profileData.address}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Country:</span>
            <span className={styles.value}>{profileData.country}</span>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default ReviewerProfileDisplay;
