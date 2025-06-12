import React from 'react';
import SearchForm from '../components/SearchForm';
import StudentForm from '../components/StudentForm';
import StaffLogin from '../components/StaffLogin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SchoolCode from '../components/SchoolCode';
import StaffHome from '../components/StaffHome';
import ClassesList from '../components/ClassesList';
import StudentsByClass from '../components/StudentsByClass';
import EditStudent from '../components/EditStudent';

function Home() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SchoolCode />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/student-form" element={<StudentForm />} />
                <Route path="/staff-home" element={<StaffHome />} />
                <Route path="/classes" element={<ClassesList />} />
                <Route path="/class/:grade" element={<StudentsByClass />} />
                <Route path="/edit-student/:id" element={<EditStudent />} />
                {/* נתיב לשליפת נתונים - נדבר עליו בהמשך */}
                {/* <Route path="/data-fetch" element={<DataFetch />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default Home;
