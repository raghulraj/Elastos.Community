import React from 'react';
import StandardPage from '../../StandardPage';
import Navigator from '@/module/page/shared/HomeNavigator/Container'
import config from '@/config';
import _ from 'lodash'
import './style.scss'
import '../../admin/admin.scss'
import { Col, Row, Icon, Form, Input, Breadcrumb, Button,
    Divider, Table, List, Carousel, Avatar, Tag } from 'antd'
import { TEAM_USER_STATUS } from '@/constant'
import MediaQuery from 'react-responsive'
import moment from 'moment/moment'
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'

const FormItem = Form.Item;

const FILTERS = {
    ALL: 'all',
    OWNED: 'owned',
    ACTIVE: 'active',
    APPLIED: 'applied',
    REJECTED: 'rejected',
}

export default class extends StandardPage {
    constructor(props) {
        super(props)

        this.state = {
            showMobile: false,
            filter: FILTERS.ALL
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.refetch()
    }

    componentWillUnmount() {
        this.props.resetTeams()
    }

    refetch() {
        let query = {
            teamHasUser: this.props.currentUserId
        }

        if (this.state.filter === FILTERS.ACTIVE) {
            query.teamHasUserStatus = TEAM_USER_STATUS.NORMAL
        }

        if (this.state.filter === FILTERS.APPLIED) {
            query.teamHasUserStatus = TEAM_USER_STATUS.PENDING
        }

        if (this.state.filter === FILTERS.REJECTED) {
            query.teamHasUserStatus = TEAM_USER_STATUS.REJECT
        }

        if (this.state.filter === FILTERS.OWNED) {
            query = {
                owner: this.props.currentUserId
            }
        }

        this.props.getTeams(query)
    }

    ord_states() {
        return {
            loading: true,
            total: 0,
            list: []
        };
    }

    ord_renderContent () {
        const teams = this.props.all_teams

        return (
            <div class="p_ProfileTeams">
                <div className="ebp-header-divider">

                </div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_admin_breadcrumb">
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    <Icon type="home" />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>Teams</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="p_admin_content">
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'profileTeams'}/>
                                    </Col>
                                </MediaQuery>
                                <Col span={20} className="c_ProfileContainer admin-right-column wrap-box-user">
                                    <div className="pull-right filter-group">
                                        <Button onClick={this.goCreatepage.bind(this)}>Create Team</Button>
                                    </div>
                                    <Button.Group className="filter-group">
                                        <Button
                                            className={(this.state.filter === FILTERS.ALL && 'selected') || ''}
                                            onClick={this.clearFilters.bind(this)}>All</Button>
                                        <Button
                                            className={(this.state.filter === FILTERS.OWNED && 'selected') || ''}
                                            onClick={this.setOwnedFilter.bind(this)}>Owned</Button>
                                        <Button
                                            className={(this.state.filter === FILTERS.ACTIVE && 'selected') || ''}
                                            onClick={this.setActiveFilter.bind(this)}>Active</Button>
                                        <Button
                                            className={(this.state.filter === FILTERS.APPLIED && 'selected') || ''}
                                            onClick={this.setAppliedFilter.bind(this)}>Applied</Button>
                                        <Button
                                            className={(this.state.filter === FILTERS.REJECTED && 'selected') || ''}
                                            onClick={this.setRejectedFilter.bind(this)}>Rejected</Button>
                                    </Button.Group>

                                    <div className="clearfix"/>
                                    {this.getListComponent()}
                                </Col>
                            </Row>
                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getCarousel(item) {
        const pictures = _.map(item.pictures, (picture, ind) => {
            return (
                <div key={ind}>
                    <img width={188} height={188} alt="logo" src={picture.url} />
                </div>
            )
        })

        return (
            <div className="carousel-wrapper">
                <Carousel autoplay>
                    {pictures}
                </Carousel>
            </div>
        )
    }

    getListComponent() {
        const teams = this.props.all_teams
        const description_fn = (entity) => {
            return _.isEmpty(entity.recruitedSkillsets)
                ? I18N.get('project.detail.not_recruiting')
                : (
                    <div className="valign-wrapper">
                        <div className="gap-right pull-left">{I18N.get('project.detail.recruiting')}: </div>
                        <div className="pull-left">
                            {_.map(entity.recruitedSkillsets, (skillset, ind) => <Tag key={ind}>{skillset}</Tag>)}
                        </div>
                    </div>
                )
        }

        const data = _.map(teams, (team, id) => {
            return {
                title: team.name,
                pictures: team.pictures || [],
                description: description_fn(team),
                content: team.profile.description,
                owner: team.owner,
                id: team._id
            }
        })

        return (
            <List itemLayout='vertical' size='large' loading={this.props.loading}
                className="with-right-box" dataSource={data}
                renderItem={item => (
                    <List.Item
                        key={item.id}
                        extra={this.getCarousel(item)}
                    >
                        <h3 class="no-margin no-padding one-line brand-color">
                            <a onClick={this.linkTeamDetail.bind(this, item.id)}>{item.title}</a>
                        </h3>
                        <h5 class="no-margin">
                            {item.description}
                        </h5>
                        <div>
                            {item.content}
                        </div>
                        <div className="ant-list-item-right-box">
                            <a className="pull-up" onClick={this.linkUserDetail.bind(this, item.owner)}>
                                <Avatar size="large" icon="user" className="pull-right" src={item.owner.profile.avatar}/>
                                <div class="clearfix"/>
                                <div>{item.owner.profile.firstName} {item.owner.profile.lastName}</div>
                            </a>
                            <Button type="primary" className="pull-down" onClick={this.linkTeamDetail.bind(this, item.id)}>View</Button>
                        </div>
                    </List.Item>
                )}
            />
        )
    }

    clearFilters() {
        this.setState({ filter: FILTERS.ALL }, this.refetch.bind(this))
    }

    setActiveFilter() {
        this.setState({ filter: FILTERS.ACTIVE }, this.refetch.bind(this))
    }

    setAppliedFilter() {
        this.setState({ filter: FILTERS.APPLIED }, this.refetch.bind(this))
    }

    setRejectedFilter() {
        this.setState({ filter: FILTERS.REJECTED }, this.refetch.bind(this))
    }

    setOwnedFilter() {
        this.setState({ filter: FILTERS.OWNED }, this.refetch.bind(this))
    }

    goCreatepage() {
        this.props.history.push('/profile/teams/create');
    }

    linkUserDetail(user) {
        this.props.history.push(`/member/${user._id}`)
    }

    linkTeamDetail(teamId) {
        this.props.history.push(`/profile/team-detail/${teamId}`)
    }
}
