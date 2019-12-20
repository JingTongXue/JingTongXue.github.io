import React, { Component, useRef } from 'react';
import { withRouter, Link } from 'react-router-dom';
import api from './api';
import 'element-theme-default';
import axios from 'axios';
import './Login.css';
import 'antd/dist/antd.css';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';

class login extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                var name = values.username;
                var password = values.password;
                api.post('/login', { name, password }).then(res => {
                    console.log(res.data.id);
                    if (res.data.id) {
                        this.props.history.push(`/restaurant/${res.data.id}/manage/`)
                    } else {
                        Modal.error({
                            centered: true,
                            width:'85vw',
                            content: "账号或密码错误！",
                            okText: "确认",
                            onOk: () => {
                                this.props.form.resetFields("password");
                            }
                        })
                    }
                })

            }
        });
    };



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="Login">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h2>管理员登录</h2>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入您的用户名!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入用户名"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入您的密码!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>记住密码</Checkbox>)}
                        <a className="login-form-forgot">
                            <Link to="/resetps">忘记密码</Link>
                        </a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        <a><Link to='/register'>
                                注册
                            </Link></a>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedNormallLoginForm = Form.create({})(login);

export default WrappedNormallLoginForm;
