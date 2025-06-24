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
import SearchDetailsPage from '../components/SearchDetailsPage';
import RecentSearchesPage from '../components/RecentSearchesPage';
import EditStaff from '../components/EditStaff';
import AddStaff from '../components/AddStaff';
import DeleteStaff from '../components/DeleteStaff';
import StaffManage from '../components/StaffManage';
import FieldsManagementPage from '../components/FieldsManagementPage';
import WaitingSearches from '../components/waitingSearches';
import SearchDetailsNotToEdit from '../components/SearchDetailsNotToEdit';
import PriorityPage from '../components/PriorityPage';


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
                <Route path="/staff/edit" element={<EditStaff />} />
                <Route path="/staff/add" element={<AddStaff />} />
                <Route path="/staff/delete" element={<DeleteStaff />} />
                <Route path="/staff-manage" element={<StaffManage />} />
                <Route path="/manage-fields" element={<FieldsManagementPage />} />
                {/* <Route path="/wait-searches" element={<WaitingSearches />} /> */}
                <Route path="/wait-searches" element={<WaitingSearches />} />
                <Route path="/search-result-not-to-edit/:id" element={<SearchDetailsNotToEdit />} />
                <Route path="/search-results/:id" element={<SearchDetailsPage />} />
                <Route path="/priority" element={<PriorityPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Home;
