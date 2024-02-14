import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import Cards from '../ResearchPaper/Cards';
import { useCookies } from 'react-cookie';
import Header from './Header';
import Footer from './Footer';

const Home = () => {
  const [token] = useCookies(['myToken']);
  

  return (
    <div className={styles.body}>
      <Header />

      <section id={styles.welcome_section} className={`${styles.center} ${styles.section}`}>
        <div id={styles.main_text}>
          <h3>Advancing Research: Empowering the Future</h3>
          <h2 style={{ textTransform: 'uppercase', marginTop: '10px', marginBottom: '10px' }}>
            Unlocking Knowledge, Empowering Innovation: Explore, Publish, Collaborate
          </h2>
          <p>
            In today's digital era, the importance of research cannot be overstated. Research papers serve as valuable
            resources for scholars, academics, and professionals seeking to expand their knowledge and contribute to the
            advancement of their respective fields. This website aims to provide a comprehensive platform for researchers
            to access, publish, and collaborate on research papers. By leveraging the power of technology, this platform
            enables seamless discovery, dissemination, and interaction with cutting-edge research.
          </p>
        </div>
        <div id={styles.hero_image}></div>
        {token['myToken'] ? (
          <Link id={styles.get_started_btn} to="/add-new" style={{ textDecoration: 'none' }}>
            Add New
          </Link>
        ) : (
          <Link id={styles.get_started_btn} to="/signup" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        )}
      </section>

      <section id="responsive" className={`${styles.center} ${styles.section}`}>
        <div id={styles.info}>
          <h1 style={{ color: 'white', marginBottom: '10px' }}>Discover the World of Research!</h1>
          <p style={{ color: 'white' }}>
            Don't miss out on the opportunity to be part of this exciting research community. Join our website today and
            unlock a world of knowledge, collaboration, and discovery. Together, let's push the boundaries of human
            understanding and shape a brighter future through research.
          </p>
        </div>
        <div id={styles.image}>
          <img className={styles.section_img} src="Responsive.png" alt="" />
        </div>
      </section>
      <section className={`${styles.center} ${styles.section}`}>
      
        <Cards />
      </section>

      
        <Footer />
      
    </div>
  );
};

export default Home;
