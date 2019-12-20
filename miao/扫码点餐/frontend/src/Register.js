import React, { Component } from 'react';
import api from './api';
import 'element-theme-default';
import 'antd/dist/antd.css';
import './Register.css';
import { Form, Icon, Input, Button, Modal } from 'antd';


class register extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                var name = values.username;//用户名
                var password = values.password;//密码
                var email = values.email;//邮箱
                var title = values.name;//餐厅名称
                api.post('/register', { name, email, password, title }).then(res => {
                    if (res.data.code === -1) {//用户名已被占用
                        Modal.error({
                            content: "用户名已被占用！",
                            okText: "确认",
                            centered: true,
                            width:'85vw',
                            onOk: () => {
                                this.props.form.resetFields("password");
                            }
                        })
                    } else {
                        Modal.success({
                            centered: true,
                            width:'85vw',
                            content: '恭喜您,注册成功,合作愉快!',
                            onOk:()=>{
                                this.props.history.push('/login');
                            }
                        });
                    }
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="Register">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h2>注册账号</h2>
                    <Form.Item>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请填写您的餐厅名称!' }],
                        })(
                            <Input
                                prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请填写您的餐厅名称"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: '请填写正确的邮箱!!',
                                },
                                {
                                    required: true,
                                    message: '请填写您的邮箱!',
                                },
                            ],
                        })(<Input
                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请填写您的邮箱"
                        />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请填写您的用户名!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请填写您的用户名"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请填写您的密码!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请填写您的密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            确定
                        </Button>
                        <Button type="dashed" onClick={() => {window.history.back()}} className="login-form-button">
                            返回
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

}
var WrappedNormanllRegisterForm = Form.create({})(register);

export default WrappedNormanllRegisterForm;