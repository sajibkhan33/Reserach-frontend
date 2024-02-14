
import './App.css';
import Login from './Components/AuthScreens/Login';
import Signup from './Components/AuthScreens/Signup';
import Home from './Components/HomeScreen/Home';
import AddNew from './Components/ResearchPaper/AddNew';
import AdminProfileCreate from './Components/ProfileScreens/AdminProfileCreate';
import ResearcherProfileCreate from './Components/ProfileScreens/ResearcherProfileCreate';
import ReaderProfileCreate from './Components/ProfileScreens/ReaderProfileCreate';
import ReviewerProfileCreate from './Components/ProfileScreens/ReviewerProfileCreate';
import AdminProfileDisplay from './Components/ProfileScreens/AdminProfileDisplay';
import ResearcherProfileDisplay from './Components/ProfileScreens/ResearcherProfileDisplay';
import ReaderProfileDisplay from './Components/ProfileScreens/ReaderProfileDisplay';
import ReviewerProfileDisplay from './Components/ProfileScreens/ReviewerProfileDisplay';
import MyRepo from './Components/ResearchPaper/MyRepo';
import ReadAll from './Components/ResearchPaper/ReadAll';
import AllSubmissions from './Components/ResearchPaper/AllSubmissions';
import PapersToReview from './Components/ResearchPaper/PapersToReview';
import PapersToPublish from './Components/ResearchPaper/PapersToPublish';
import CommentsPage from './Components/ResearchPaper/CommentsPage';
import UpdatePage from './Components/ResearchPaper/UpdatePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-new" element={<AddNew />} />
          <Route path="/my-repo" element={<MyRepo />} />
          <Route path="/read-all" element={<ReadAll />} />
          <Route path="/all-submissions" element={<AllSubmissions />} />
          <Route path="/papers-to-review" element={<PapersToReview />} />
          <Route path="/papers-to-publish" element={<PapersToPublish />} />
          <Route path="/comments/:researchPaperId" element={<CommentsPage />} />
          <Route path="/update/:researchPaperId" element={<UpdatePage />} />
          <Route path="/admin-profile-create" element={<AdminProfileCreate />} />
          <Route path="/researcher-profile-create" element={<ResearcherProfileCreate />} />
          <Route path="/reader-profile-create" element={<ReaderProfileCreate />} />
          <Route path="/reviewer-profile-create" element={<ReviewerProfileCreate />} />
          <Route path="/admin-profile-display" element={<AdminProfileDisplay />} />
          <Route path="/researcher-profile-display" element={<ResearcherProfileDisplay />} />
          <Route path="/reader-profile-display" element={<ReaderProfileDisplay />} />
          <Route path="/reviewer-profile-display" element={<ReviewerProfileDisplay />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
