import React from 'react';
import StudentForm from '../components/StudentForm';
import StaffLogin from '../components/StaffLogin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SchoolCode from '../components/SchoolCode';
import StaffHome from '../components/StaffHome';
import ClassesList from '../components/ClassesList';
import StudentsByClass from '../components/StudentsByClass';
import EditStudent from '../components/EditStudent';
import SearchFormPage from '../components/SearchFormPage';
import SearchResults from '../components/SearchResults';
import SearchDetailsPage from '../components/SearchDetailsPage';
import RecentSearchesPage from '../components/RecentSearchesPage';

function Home() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SchoolCode />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/student-form" element={<StudentForm />} />
                <Route path="/staff-home" element={<StaffHome />} />
                <Route path="/classes" element={<ClassesList />} />
                <Route path="/class/:class/:grade" element={<StudentsByClass />} />
                <Route path="/edit-student/:id" element={<EditStudent />} />
                <Route path="/data-fetch" element={<SearchFormPage />} />
                <Route path="/recent-searches" element={<RecentSearchesPage />} />
                <Route path="/search-results/:id" element={<SearchResults />} />
                {/* <Route path="/search-results/:id" element={<SearchDetailsPage />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default Home;
