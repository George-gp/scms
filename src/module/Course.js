import React from 'react'
import $ from 'jquery';
import {Button, Table, Divider} from 'antd'

class Course extends React.Component {
  constructor() {
    super();
    this.state = {
      flag: false,
      teachers: [],
      courses: [],
      form: {
        name: "",
        credit: "",
        description: "",
        teacherId: ""
      }
    }
  }

  componentDidMount() {
    // 1. 加载教师信息
    this.loadTeachers();
    // 2. 加载课程信息
    this.loadCourses();
  }
  //加载教师信息
  loadTeachers() {
    $.get("http://localhost:8888/User/findAllTeacher", ({ status, message, data }) => {
      if (status === 200) {
        this.setState({
          "teachers": data,
          form: { ...this.state.form, ...{ teacherId: data[0].id } }
        })
      } else { alert(message) }
    })
  }
  // 加载课程信息
  loadCourses() {
    $.get("http://localhost:8888/course/findAllWithTeacher", ({ status, message, data }) => {
      if (status === 200) {
        // 将查询数据设置到state中
        this.setState({ "courses": data })
      } else { alert(message) }
    })
  }

  //表单数据绑定事件
  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      form: { ...this.state.form, ...{ [name]: value } }
    })
  }

  //提交事件
  submitHandler = (event) => {
    let url = "http://localhost:8888/course/saveOrUpdate"
    $.post(url, this.state.form, ({ message }) => {
      alert(message);
      //刷新
      this.loadCourses();
    })
    event.preventDefault();
  }

  //更新事件
  toUpdate(id) {
    // 1. 通过id查找课程信息
    // 2. 将返回结果设置到this.state.form中
    // state->form
    $.get("http://localhost:8888/course/findById?id=" + id, ({ status, message, data }) => {
      if (status === 200) {
        // 将查询数据设置到state中
        this.setState({ flag: true, "form": data })
      } else { alert(message) }
    })
  }

  toAdd = () => {
    this.setState({
      flag: !this.state.flag,
      form: {
        name: "",
        credit: "",
        description: "",
        teacherId: this.state.form.teacherId
      }
    })

  }

  toDel(id) {
    $.get("http://localhost:8888/course/deleteById?id=" + id, ({ status, message }) => {
      alert(message)
      this.loadCourses()
    })
  }

  render() {
    let { teachers, courses, form, flag } = this.state;
    let $form;
    let columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '课程名称',
        dataIndex: 'name',
      },
      {
        title: '课程学分',
        dataIndex: 'credit',
      },
      {
        title: '课程介绍',
        dataIndex: 'description',
      },
      {
        title: '任课老师',
        dataIndex: 'teacher.realname',
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <Button onClick={this.toUpdate.bind(this,record.id)}>更新</Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={this.toDel.bind(this,record.id)}>删除</Button>
          </span>
        ),
      },
    ];

    if (flag) {
      $form = (
        <form onSubmit={this.submitHandler}>
          课程名称
              <input type="text" name="name" value={form.name} onChange={this.changeHandler} />
          课程学分
              <input type="number" name="credit" value={form.credit} onChange={this.changeHandler} />
          课程简介
              <textarea name="description" value={form.description} style={{ height: '20px' }} onChange={this.changeHandler}></textarea>
          任课老师
              <select name="teacherId" value={form.teacherId} onChange={this.changeHandler}>
            {
              teachers.map((item) => {
                return <option value={item.id} key={item.id} >{item.realname}</option>
              })
            }
          </select>
          <input type="submit" value="提交" />
        </form>
      )
    }

    return (
      <div>
        <h2>课程管理</h2>
        <div>
          <Button type="primary" onClick={this.toAdd}>添加</Button>
          <Button type="danger">批量删除</Button>
        </div>
        {/* 表单 */}
        {$form}
        {/* 表格 */}
        <div>
          <Table rowKey={record => record.id} dataSource={courses} columns={columns} />
        </div>
        {JSON.stringify(form)}
      </div>
    )
  }
}

export default Course