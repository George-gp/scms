import React from 'react'
import $ from 'jquery';
import {Button, Table, Divider, Modal} from 'antd'

class StudentCourse extends React.Component {
    constructor() {
        super();
        this.state = {
          flag: false,
          student: [],
          course: [],
          studentcourse: [],
          form: {
            grade: "",
            studentId: "",
            courseId: "",
            visible: false
          }
        }
      }
    
      componentDidMount() {
        // 1. 加载选课信息
        this.loadStudentCourse();
        // 2. 加载学生信息
        this.loadStudent()
        this.loadCourse()
      }
      loadStudentCourse() {
        $.get("http://localhost:8888/studentCourse/findAll", ({ status, message, data }) => {
          if (status === 200) {
            // 将查询数据设置到state中
            this.setState({ "studentcourse": data })
          } else { alert(message) }
        })
      }

      loadStudent() {
        $.get("http://localhost:8888/User/findAllStudent", ({ status, message, data }) => {
          if (status === 200) {
            // 将查询数据设置到state中
            this.setState({ "student": data ,
            form: { ...this.state.form, ...{ studentId: data[0].id } }
          })
          } else { alert(message) }
        })
      }
    
      loadCourse() {
        $.get("http://localhost:8888/course/findAll", ({ status, message, data }) => {
          if (status === 200) {
            // 将查询数据设置到state中
            this.setState({ "course": data ,
            form: { ...this.state.form, ...{ courseId: data[0].id } }
          })
            
          } else { alert(message) }
        })
      }
      changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
          form: { ...this.state.form, ...{ [name]: value } }
        })
      }
    
      submitHandler = (event) => {
        let url = "http://localhost:8888/studentCourse/saveOrUpdate"
        $.post(url, this.state.form, ({ message }) => {
          alert(message);
          //刷新
          this.loadStudentCourse();
        })
        event.preventDefault();
      }
    
      //更新事件
      toUpdate(id) {
        // 1. 通过id查找课程信息
        // 2. 将返回结果设置到this.state.form中
        // state->form
        $.get("http://localhost:8888/studentCourse/findById?id=" + id, ({ status, message, data }) => {
          if (status === 200) {
            // 将查询数据设置到state中
            this.setState({ flag: true, "form": data })
          } else { alert(message) }
        })
      }
    
      //添加事件
      toAdd = () => {
        this.setState({
          flag: !this.state.flag,
          form: {
            grade: "",
            studentId: this.state.form.studentId,
            courseId: this.state.form.courseId
          }
        })
    
      }
    
      //删除事件
      toDel(id) {
        $.get("http://localhost:8888/studentCourse/deleteById?id=" + id, ({ status, message }) => {
          this.loadStudentCourse()
        })
      }
    
      //展示Model
      showModal = () => {
        this.setState({
          visible: true,
        });
      }

      //Model确定
      handleOk(id) {
        this.toDel(id)
        this.setState({
          visible: false,
        });
      };

      //Model取消
      handleCancel = () => {
        this.setState({
          visible: false,
        });
      };

      render() {
        let { studentcourse, student, course, form, flag } = this.state;
        let $form;
        let columns = [
          {
            title: '编号',
            dataIndex: 'id',
          },
          {
            title: '选课时间',
            dataIndex: 'chooseTime',
          },
          {
            title: '年级',
            dataIndex: 'grade',
          },
          {
            title: '学生姓名',
            dataIndex: 'student.realname',
          },
          {
            title: '课程名称',
            dataIndex: 'course.name',
          },
          {
            title: '操作',
            render: (text, record) => (
              <span>
                <Button onClick={this.toUpdate.bind(this,record.id)}>更新</Button>
                <Divider type="vertical" />
                <Button type="danger" onClick={this.showModal}>
                  删除
                  </Button>
                  <Modal
                    title="确认框"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this,record.id)}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确认"
                  >
                    <p>确认删除？</p>
                  </Modal>
              </span>
            ),
          },
        ];
        //利用flag判断表单是否显示
        if (flag) {
          $form = (
            <form onSubmit={this.submitHandler}>
              年级
                  <input type="number" name="grade" value={form.grade} onChange={this.changeHandler} />
              学生
                <select name="studentId" value={form.studentId} onChange={this.changeHandler}>
                  {
                    student.map((item) => {
                      return <option value={item.id} key={item.id} >{item.realname}</option>
                    })
                  }
                </select>
              课程
              <select name="courseId" value={form.courseId} onChange={this.changeHandler}>
                {
                  course.map((item) => {
                    return <option value={item.id} key={item.id} >{item.name}</option>
                  })
                }
              </select>
              <input type="submit" value="提交" />
            </form>
          )
        }
    
        return (
          <div>
            <h2>选课管理</h2>
            <div>
              <Button type="primary" onClick={this.toAdd}>添加</Button>
              <Button type="danger">批量删除</Button>
            </div>
            {/* 表单 */}
            {$form}
            {/* 表格 */}
            <div>
             <Table rowKey={record => record.id} dataSource={studentcourse} columns={columns} />
            </div>
            {JSON.stringify(form)}
          </div>
        )
      }
}

export default StudentCourse