import React from 'react';
import './App.css';
import Student from './module/Student'
import Course from './module/Course'
import Teacher from './module/Teacher'
import StudentCourse from './module/StudentCourse'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <div className="title">
        <h1>学生管理系统后台</h1>
      </div>
      <BrowserRouter>
        <div className="nav">
          <ul>
            <li><Link to="/student">学生管理</Link></li>
            <li><Link to="/course">课程管理</Link></li>
            <li><Link to="/teacher">教师管理</Link></li>
            <li><Link to="/sc">选课管理</Link></li>
          </ul>
        </div>
        <div className="content">
          <Switch>
            <Route path="/student" component={Student} />
            <Route path="/course" component={Course} />
            <Route path="/teacher" component={Teacher} />
            <Route path="/sc" component={StudentCourse} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
