import React from 'react'
import $ from 'jquery'
import {Button, Table, Divider, Modal} from 'antd'

class Teacher extends React.Component{
    constructor() {
        super();
        this.state = {
          flag: false,
          teachers: [],
          form: {
            realname: "",
            gender: "",
            username: "",
            password: "",
            type: "",
            visible: false
          }
        }
      }
    
      componentDidMount() {
        // 1. 加载老师信息
        this.loadTeachers();
      }
      //加载老师信息
      loadTeachers() {
        $.get("http://localhost:8888/User/findAllTeacher", ({ status, message, data }) => {
          if (status === 200) {
            this.setState({
              "teachers": data,
            })
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
        let url = "http://localhost:8888/User/saveOrUpdate"
        $.post(url, this.state.form, ({ message }) => {
          alert(message);
          //刷新
          this.loadTeachers();
        })
        event.preventDefault();
      }
    
      //更新事件
      toUpdate(id) {
        // 1. 通过id查找课程信息
        // 2. 将返回结果设置到this.state.form中
        // state->form
        $.get("http://localhost:8888/User/findById?id=" + id, ({ status, message, data }) => {
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
            realname: "",
            gender: "男",
            username: "",
            password: "",
            type: "教师"
          }
        })
    
      }
    
      //删除事件
      toDel(id) {
        $.get("http://localhost:8888/User/deleteById?id=" + id, ({ status, message }) => {
          this.loadTeachers()
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
        let { teachers, form, flag } = this.state;
        let $form;
        let columns = [
          {
            title: '编号',
            dataIndex: 'id',
          },
          {
            title: '姓名',
            dataIndex: 'realname',
          },
          {
            title: '性别',
            dataIndex: 'gender',
          },
          {
            title: '用户名',
            dataIndex: 'username',
          },
          {
            title: '密码',
            dataIndex: 'password',
          },
          {
            title: '职位',
            dataIndex: 'type',
          },
          {
            title: '状态',
            dataIndex: 'status',
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
              姓名
                  <input type="text" name="realname" value={form.realname} onChange={this.changeHandler} />
              性别
                <select name="gender" value={form.gender} onChange={this.changeHandler}>
                        <option value="男" key="男" >男</option>
                        <option value="女" key="女" >女</option>
                </select>
              用户名
              <input type="text" name="username" value={form.username} onChange={this.changeHandler} />
              密码
                 <input type="password" name="password" value={form.password} onChange={this.changeHandler} />     
              职位
                <select name="type" value={form.type} onChange={this.changeHandler}>
                        <option value="教师" key="教师" >教师</option>
                        <option value="学生" key="学生" >学生</option>
                </select>
                <input type="submit" value="提交" />
            </form>
          )
        }
    
        return (
          <div>
            <h2>老师管理</h2>
            <div>
              <Button type="primary" onClick={this.toAdd}>添加</Button>
              <Button type="danger">批量删除</Button>
            </div>
            {/* 表单 */}
            {$form}
            {/* 表格 */}
            <div>
             <Table rowKey={record => record.id} dataSource={teachers} columns={columns} />
            </div>
            {JSON.stringify(form)}
          </div>
        )
      }
}

export default Teacher