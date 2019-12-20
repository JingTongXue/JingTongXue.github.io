import React, { Component, Suspense } from 'react';
import { Form, Icon, Input, Button, Checkbox, Card, Upload, message } from 'antd';
import api from './api';
import './FoodAmend.css'
import history from './history';
// import { fromJS } from 'immutable';
// import { useParams } from 'react-router-dom';

var imgSty = {
    'width': '48vw',
    'height': '48vw',
    objectFit: 'cover',
    position: 'absolute',
    left: '-3vw',
}
var aSty = {
    position: 'relative',
}
const FormItem = Form.Item;
//form代码，没有什么改进，把下面的提交按钮去掉就行
class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {9ik,  
            food: null,
            loding: false,
            loading: true,
            img: null
        }
    }

    componentDidMount() {
        api.get(`/restaurant/1/food/${this.props.match.params.fid}`).then(res => {
            this.setState({
                food: res.data,
                loding: true,
            })
        });
    }
    normFile = info => {
        return info.fileList.length ? info.fileList.slice(-1) : info.fileList
    };
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
                api.put('/restaurant/:rid/food/' + this.state.food.id, fd).then(res => {
                    console.log(res.data);
                    history.push(`/restaurant/1/manage/food`);
                })
            }
        });
    };

    imgAction = e => {
        if (this.state.img) {
            var img = 'http://localhost:5000/upload/' + this.state.img;
            return img;
        } else {
            return null;
        }
    }
    render() {

        console.log(this.state.food);
        const { getFieldDecorator } = this.props.form;
        if (this.state.loding) {
            return (
                <div id="FoodAmend">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <h2>修改菜品</h2>
                        <Form.Item className='item' label="菜名">
                            {getFieldDecorator('name', {
                            })(
                                <Input
                                    placeholder={this.state.food.name}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className='items' label="描述">
                            {getFieldDecorator('desc', {
                            })(
                                <Input
                                    placeholder={this.state.food.desc}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className='items' label="分类">
                            {getFieldDecorator('category', {
                            })(
                                <Input
                                    placeholder={this.state.food.category}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className='items' label="价格">
                            {getFieldDecorator('price', {
                            })(
                                <Input
                                    placeholder={this.state.food.price}
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
                </div>
            );
        } else {
            return (
                <div>
                    <h3>加载中......</h3>
                </div>
            )
        }
    }
}

const WrappedFoodAmendForm = Form.create()(NormalLoginForm);

export default WrappedFoodAmendForm;
