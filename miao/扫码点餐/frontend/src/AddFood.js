import React, { useState, Component } from 'react';
import history from './history';
import api from './api';
import 'antd/dist/antd.css';
// import './Register.css';
import { Form, Icon, Input, Button, Checkbox, Upload } from 'antd';


const FormItem = Form.Item;

class AddFood extends Component {


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const fd = new FormData();
                for (let key in values) {
                    let val;
                    if (key === 'img' && values[key] !== undefined) {
                        console.log(values[key][0].originFileObj);

                        val = values[key] && values[key][0].originFileObj;
                    } else {
                        val = values[key];
                    }
                    (typeof val === 'string') && (val = val.trim());
                    fd.append(key, val);
                }
                api.post('/restaurant/:rid/food/', fd).then(res => {
                    console.log(res.data);
                    history.push(`/restaurant/1/manage/food`);
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
                    <h2>添加菜品</h2>
                    <Form.Item className='item' label="菜名">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入您的菜品名称!' }],
                        })(
                            <Input
                                placeholder='请填写您的菜品名称'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className='items' label="描述">
                        {getFieldDecorator('desc', {
                            rules: [{ required: true, message: '请输入您的菜品描述!' }],
                        })(
                            <Input
                                placeholder='请填写您的菜品描述'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className='items' label="分类">
                        {getFieldDecorator('category', {
                            rules: [{ required: true, message: '请输入您的菜品分类!' }],
                        })(
                            <Input
                                placeholder='请填写您的菜品分类'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className='items' label="价格">
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: '请输入您的菜品价格!' }],
                        })(
                            <Input
                                placeholder='请填写您的菜品价格'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className='items' label="更改图片">
                        {getFieldDecorator('img', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                        })(
                            <Upload
                                beforeUpload={(file) => { return false; }}
                            >
                                <Button className="ant-btns">
                                    <Icon type="upload" /> 点击上传
                                    </Button>
                            </Upload>,
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            确定
                                </Button>
                        <Button type="dashed" onClick={() => { window.history.back() }} className="login-form-button buttonF">
                            返回
                                </Button>
                    </Form.Item>

                </Form>


                {/* <form onSubmit={submit}>
                    名称:<input type="text" onChange={change} defaultValue={foodInfo.name} name="name" />
                    描述:<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc" />
                    价格:<input type="text" onChange={change} defaultValue={foodInfo.price} name="price" />
                    分类:<input type="text" onChange={change} defaultValue={foodInfo.category} name="category" />
                    图片:<input type="file" onChange={imgChange} name="img" /><br/>
                <button>提交</button>
                </form> */}
            </div>
        )
    }
}

// export default AddFood;

var WrappedNormanllAddFoodForm = Form.create({})(AddFood);

export default WrappedNormanllAddFoodForm;



