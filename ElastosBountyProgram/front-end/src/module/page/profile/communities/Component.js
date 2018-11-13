import React from 'react';
import ProfilePage from '../../ProfilePage';
import Navigator from '@/module/page/shared/HomeNavigator/Container'
import I18N from '@/I18N'
import { message } from 'antd'
import config from '@/config'
import './style.scss'
import '../../admin/admin.scss'

import { Col, Row, Icon, Form, Breadcrumb, Button, Table, Divider } from 'antd'
import moment from 'moment/moment'

import MediaQuery from 'react-responsive'

export default class extends ProfilePage {

    componentDidMount() {
        super.componentDidMount()
        this.props.getMyCommunities(this.props.currentUserId)
    }

    leaveCommunity(communityId) {
        this.props.removeMember(this.props.currentUserId, communityId).then(() => {
            this.props.getMyCommunities(this.props.currentUserId)
            message.success(I18N.get('profile.community.leave.success'))
        })
    }

    ord_renderContent () {
        const myCommunities = this.props.myCommunities
        const columns = [{
            title: I18N.get('profile.community.table.name'),
            dataIndex: 'name',
            width: '30%',
            className: 'fontWeight500 allow-wrap',
        }, {
            title: I18N.get('profile.community.table.geolocation'),
            dataIndex: 'geolocation',
            render: (geolocation, record) => {
                return config.data.mappingCountryCodeToName[geolocation] || geolocation
            }
        }, {
            title: I18N.get('profile.community.table.type'),
            dataIndex: 'type',
        }, {
            title: I18N.get('profile.community.table.actions'),
            dataIndex: '_id',
            key: 'actions',
            className: 'right-align',
            render: (id, record) => {
                // cannot leave profile country
                if (this.props.profileCountry === record.geolocation) {
                    return
                }

                return (
                    <Button onClick={this.leaveCommunity.bind(this, id)} className="btn-leave">{I18N.get('circle.header.leave')}</Button>
                )
            }
        }]

        return (
            <div>
                <div className="ebp-header-divider">

                </div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_admin_breadcrumb">
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    <Icon type="home" />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{I18N.get('0200')}</Breadcrumb.Item>
                                <Breadcrumb.Item>{I18N.get('profile.community.title')}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="p_ProfileCommunities p_admin_content">
                            <MediaQuery maxWidth={720}>
                                <Row>
                                    <Col className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'profileCommunities'} />
                                    </Col>
                                </Row>
                            </MediaQuery>
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'profileCommunities'}/>
                                    </Col>
                                </MediaQuery>
                                <Col xs={{span: 24}} md={{span: 20}} className="c_ProfileContainer admin-right-column wrap-box-user">
                                    <h3 className="no-margin">{I18N.get('profile.community.joincommunity')}</h3>

                                    <Table
                                        columns={columns}
                                        rowKey={(item) => item._id}
                                        dataSource={myCommunities}
                                        loading={this.props.loading}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    linkSubmissionDetail(submissionId) {
        this.props.history.push(`/profile/submission-detail/${submissionId}`)
    }
}
