import React, {  Component } from 'react';
import history from './history';
import api from './api';
import 'antd/dist/antd.css';
import './AddDesk.css';
import { Form, Icon, Input, Button, Checkbox, Upload } from 'antd';


const FormItem = Form.Item;

class AddDesk extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // const fd = new FormData();
                // for (let key in values) {
                //     let value = values[key];
                //     fd.append(key, value);
                // }
                const name = values.name;
                const capacity = values.capacity;
                // console.log(fd);
                
                api.post('/restaurant/1/desk',{name,capacity}).then(res => {
                    console.log(res.data);
                    history.push(`/restaurant/1/manage/desk`);
                    console.log('添加成功');
                })
            }
        });
    };
    normFile = info => {
        return info.fileList.length ? info.fileList.slice(-1) : info.fileList
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h2>添加桌面</h2>
                    <Form.Item className='item' label="桌号">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入您的桌号!' }],
                        })(
                            <Input
                                placeholder='请填写您的桌号'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className='capacity' label="人数">
                        {getFieldDecorator('capacity', {
                            rules: [{ required: true, message: '请输入桌面人数!' }],
                        })(
                            <Input
                                placeholder='请填写桌面人数'
                            />,
                        )}
                    </Form.Item>
                    

                    <Form.Item className='buttons' >
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            确定
                                </Button>
                        <Button type="dashed" onClick={() => { window.history.back() }} className="login-form-button buttonF">
                            返回
                                </Button>
                    </Form.Item>

                </Form>
            </div>
        )
    }
}

// export default AddFood;

var WrappedNormanllAddDeskForm = Form.create({})(AddDesk);

export default WrappedNormanllAddDeskForm;



