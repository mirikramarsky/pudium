import React from 'react';
import SearchForm from '../components/SearchForm';
import StudentForm from '../components/StudentForm';

function Home() {
  return (
    <div>
      <h1>Search Management</h1>
      {/* <SearchForm /> */}
      <StudentForm></StudentForm>
    </div>
  );
}

export default Home;
