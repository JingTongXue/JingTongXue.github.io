import React, { Component } from 'react';
import api from './api';
import 'element-theme-default';
import 'antd/dist/antd.css';
import './Resetps.css';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';


class resetps extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                var email = values.email;//邮箱
                var username = values.username;//用户名
                var password = values.password;//密码
                var password1 = values.password1;//确认密码
                if(password !== password1){
                    Modal.error({
                        content: "两次密码不一致！",
                        okText: "确认",
                        centered: true,
                        width:'85vw',
                        onOk: () => {
                            this.props.form.resetFields("password");
                        }
                    })
                }else{
                    api.post('/forgot',{ email, username, password}).then(res => {
                        if(res.data.code == -1){//无此用户
                            Modal.error({
                                content:"不存在此用户!",
                                okText:"确认",
                                centered: true,
                                width:'85vw',
                                onOK:() => {
                                    this.props.form.resetFields("password");
                                }
                            })
                        }else{
                            Modal.success({
                                centered: true,
                                width:'85vw',
                                content: '找回密码成功!',
                                onOk:()=>{
                                    this.props.history.push('/login');
                                }
                            });
                        }
                    })
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="Resetps">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h2>找回密码</h2>
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
                        {getFieldDecorator('password1', {
                            rules: [{ required: true, message: '请确认您的密码!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请确认您的密码"
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
                        <Button type="dashed" onClick={() => { window.history.back() }} className="login-form-button">
                            返回
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

var WrappedNormanllResetpsForm = Form.create({})(resetps);

export default WrappedNormanllResetpsForm;