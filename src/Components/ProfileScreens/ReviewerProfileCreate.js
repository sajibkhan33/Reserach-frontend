import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import styles from './ReviewerProfileCreate.module.css';
import Header from '../HomeScreen/Header';
import { useNavigate } from 'react-router-dom'

const ReviewerProfileCreate = () => {
  const [token] = useCookies(['myToken']);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [institute, setInstitute] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [profile, setProfile] = useCookies(['myProfile']);


  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');


  const createProfile = async () => {
    setErrorMessage('');
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/reviewer-profiles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.myToken}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          gender: gender,
          phone_number: phoneNumber,
          institute: institute,
          address: address,
          country: country,
        }),
      });
      if (response.ok) {
        setProfile('profile', "True");
        navigate('/home');
      } else {
        console.log('Failed to create profile');
        setErrorMessage('Failed to add research paper. Please try again later.');
      }
    } catch (error) {
      console.log('Error creating profile:', error);
      setErrorMessage('Failed to add research paper. Please try again later.');
    }
  };

  return (
    <div>
    <Header/>
    <div className={styles.profile}>
      <form onSubmit={createProfile}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender:</label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="institute">Institute:</label>
          <input type="text" id="institute" value={institute} onChange={(e) => setInstitute(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="country">Country:</label>
          <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default ReviewerProfileCreate;
