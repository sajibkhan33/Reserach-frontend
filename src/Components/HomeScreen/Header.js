import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faStar, faUserLock, faUser, faSignOutAlt, faPlus, faUserPlus, faFolderOpen, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';


const Header = () => {
  const [token, , removeToken] = useCookies(['myToken']);
  const [group, , removeGroup] = useCookies(['myGroup']);
  const [profile, , removeProfile] = useCookies(['myProfile']);
  const navigate = useNavigate();

  const logoutSubmitted = () => {
    removeToken('myToken');
    removeGroup('myGroup');
    removeProfile('myProfile');
    navigate('/home');
  };

  const renderLink = (to, icon, text, color = 'black') => (
    <li className={styles.nav_link}>
      <Link to={to} className={styles.link} style={{ color, textDecoration: 'none' }}>
        <div className={styles.iconContainer}>
          <FontAwesomeIcon icon={icon} color={color} size="lg" className={styles.icon} />
          <span className={styles.text}>{text}</span>
        </div>
      </Link>
    </li>
  );

  const [showProfileLink, setShowProfileLink] = useState(false);

  useEffect(() => {
    if (group['myGroup'] === 'READER' || group['myGroup'] === 'RESEARCHER' || group['myGroup'] === 'REVIEWER' || group['myGroup'] === 'ADMIN')  {
      setShowProfileLink(profile['profile'] === 'True');
    }
  }, [group, profile]);

  console.log(profile['profile']);

  return (
    <header id={styles.header}>
      <Link to="/home" style={{ textDecoration: 'none' }}>
      <img id={styles.logo} className={styles.site_logo} src={logo} alt="" />
      </Link>

      <div id={styles.nav_container_lg}>
        <ul className={styles.nav_list}>
          {renderLink('/home', faHouse, 'Home', 'white')}
          <li className={styles.nav_link}>
            <p style={{ fontSize: '20px' }}>|</p>
          </li>
          {renderLink('/read-all', faBoxOpen, 'Read All')}
          <li className={styles.nav_link}>
            <p style={{ fontSize: '20px' }}>|</p>
          </li>
          {group['myGroup'] === 'RESEARCHER' && (
            <>
              {renderLink('/add-new', faPlus, 'New', 'black')}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
              {renderLink('/my-repo', faFolderOpen, 'My Repo', 'black')}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
            </>
          )}
          {group['myGroup'] === 'REVIEWER' && (
            <>
              {renderLink('/papers-to-review', faStar, 'Review', 'black')}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
              
            </>
          )}
          {group['myGroup'] === 'ADMIN' && (
            <>
              {renderLink('/papers-to-publish', faPlus, 'Publish', 'black')}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
              {renderLink('/all-submissions', faFolderOpen, 'All Submissions', 'black')}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
            </>
          )}
          {group['myGroup'] === 'RESEARCHER' && (
            <div className={styles.nav_list}>
              {showProfileLink ? (
                renderLink('/researcher-profile-display', faUser, 'Profile')
              ) : (
                renderLink('/researcher-profile-create', faUserPlus, 'Create Profile')
              )}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
            </div>
          )}
          {group['myGroup'] === 'READER' && (
            <div className={styles.nav_list}>
              {showProfileLink ? (
                renderLink('/reader-profile-display', faUser, 'Profile')
              ) : (
                renderLink('/reader-profile-create', faUserPlus, 'Create Profile')
              )}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
            </div>
          )}
          {group['myGroup'] === 'REVIEWER' && (
            <div className={styles.nav_list}>
              {showProfileLink ? (
                renderLink('/reviewer-profile-display', faUser, 'Profile')
              ) : (
                renderLink('/reviewer-profile-create', faUserPlus, 'Create Profile')
              )}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
            </div>
          )}
          {group['myGroup'] === 'ADMIN' && (
            <div className={styles.nav_list}>
              {showProfileLink ? (
                renderLink('/admin-profile-display', faUser, 'Profile')
              ) : (
                renderLink('/admin-profile-create', faUserPlus, 'Create Profile')
              )}
              <li className={styles.nav_link}>
                <p style={{ fontSize: '20px' }}>|</p>
              </li>
            </div>
          )}
          
          {token['myToken'] ? (
            <li className={styles.nav_link}>
              <Link onClick={logoutSubmitted} to="/login" className={styles.link} style={{ color: 'black', textDecoration: 'none !important' }}>
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faSignOutAlt} color="black" size="lg" className={styles.icon} />
                  <span className={styles.text}>Log Out</span>
                </div>
              </Link>
            </li>
          ) : (
            renderLink('/login', faUserLock, 'Login/Signup')
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
