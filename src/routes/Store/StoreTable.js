import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  Badge,
  Tooltip,
  Popover,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { open } from '../../services/store';

import styles from './StoreTable.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['休息中', '在营业', '已就绪', '有异常'];

class DoorPanel extends PureComponent {
  state = {
    entrance: 'lock',
    exit: 'lock',
  };
  open = (door) => {
    if (this.state[door] === 'unlock') {
      return;
    }
    this.setState({
      [door]: 'opening',
    });
    open({ shop: this.props.shop, door })
      .then(() => {
        this.setState({
          [door]: 'unlock',
        });
        setTimeout(() => {
          this.setState({
            [door]: 'lock',
          });
        }, 3000);
      })
      .catch(() => {
        this.setState({
          [door]: 'lock',
        });
      });
  };
  render() {
    return (
      <Button.Group>
        <Button
          type={this.state.entrance === 'lock' ? 'danger' : 'primary'}
          icon={this.state.entrance}
          loading={this.state.entrance === 'opening'}
          onClick={() => this.open('entrance')}
        >
          入口
        </Button>
        <Button
          type={this.state.exit === 'lock' ? 'danger' : 'primary'}
          icon={this.state.exit}
          loading={this.state.exit === 'opening'}
          onClick={() => this.open('exit')}
        >
          出口
        </Button>
      </Button.Group>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
export default class StoreTable extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/query',
    });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      sorter: true,
      render: text => <a href="#">{text}</a>,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '城市',
      dataIndex: 'address.city',
    },
    {
      title: '地址',
      dataIndex: 'address.street',
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      render: (text, record) => (
        <Tooltip title={record.mobile}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popover content={<DoorPanel shop={record.id} />} trigger="click">
            <a>芝麻开门</a>
          </Popover>
        </Fragment>
      ),
    },
  ];

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'store/query',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'store/query',
      payload: {},
    });
  };

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'store/query',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('id')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="城市">
              {getFieldDecorator('city')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">休息中</Option>
                  <Option value="1">在营业</Option>
                  <Option value="2">已就绪</Option>
                  <Option value="3">有异常</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { store: { data }, loading } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="店铺列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
