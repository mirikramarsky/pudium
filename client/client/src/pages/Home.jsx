import React, { useEffect, useRef } from 'react';
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
import WelcomePage from '../components/WelcomePage';
import { useLocation } from 'react-use';
import SearchByStudent from '../components/SearchByStudent';
import AddStudents from '../components/AddStudents';
import StudentsFieldsTable from '../components/Fieldtable';
import SearchesByClasses from '../components/SercehsByClasses';
// import BottomBanner from '../components/BottomBanner';

function Layout({ children }) {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  return (
    <div className="page-wrapper">
      <div className="side-image"></div>

      {isWelcomePage ? (
        children
      ) : (
        <div className="content-card">
          {children}
        </div>
      )}
    </div>
  );
}

function Home() {
    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/school-id" element={<SchoolCode />} />
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
                        <Route path="/wait-searches" element={<WaitingSearches />} />
                        <Route path="/search-result-not-to-edit/:id" element={<SearchDetailsNotToEdit />} />
                        <Route path="/search-results/:id" element={<SearchDetailsPage />} />
                        <Route path="/priority" element={<PriorityPage />} />
                        <Route path="/search-by-student" element={<SearchByStudent />} />
                        <Route path="/addStudents" element={<AddStudents />} />
                        <Route path="/fill-students-fields" element={<StudentsFieldsTable />} />
                        <Route path="/class-searches/:class/:grade" element={<SearchesByClasses />} />  
                    </Routes>
                </Layout>
            </BrowserRouter>
            {/* <BottomBanner></BottomBanner> */}
        </>
    );
}

export default Home;
