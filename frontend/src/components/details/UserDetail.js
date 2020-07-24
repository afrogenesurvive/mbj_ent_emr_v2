import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';

import UserAddressList from '../lists/user/UserAddressList'
import UserAttendanceList from '../lists/user/UserAttendanceList'
import UserLeaveList from '../lists/user/UserLeaveList'
import UserImageList from '../lists/user/UserImageList'
import UserFileList from '../lists/user/UserFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import UserNoteList from '../lists/user/UserNoteList'

import FilterAddressForm from '../forms/filter/FilterAddressForm';
import FilterAttendanceForm from '../forms/filter/FilterAttendanceForm';
import FilterLeaveForm from '../forms/filter/FilterLeaveForm';
import FilterImageForm from '../forms/filter/FilterImageForm';
import FilterFileForm from '../forms/filter/FilterFileForm';
import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../forms/filter/FilterNoteForm';

import UpdateSingleFieldForm from '../forms/add/UpdateSingleFieldForm';
import AddAddressForm from '../forms/add/AddAddressForm';
import AddAttendanceForm from '../forms/add/AddAttendanceForm';
import AddLeaveForm from '../forms/add/AddLeaveForm';
import AddNoteForm from '../forms/add/AddNoteForm';
import AddImageForm from '../forms/add/AddImageForm';
import AddFileForm from '../forms/add/AddFileForm';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './details.css';

class UserDetail extends Component {
  state = {
    activityA: null,
    role: null,
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
    activityUser: null,
    isLoading: false,
    seshStore: null,
    profileLoaded: false,
    sideCol: 'menu',
    filter: {
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
    adding: {
      state: null,
      field: null
    },
    canDelete: false,
    updateSingleField: {
      state: null,
      field: null
    },
    detailedUser: null,
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    // this.props2 = this.props;
  }

componentDidMount () {
  console.log('...staff details component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
  }
  this.setState({
    detailedUser: this.props.user
  })
}
componentWillUnmount() {

}




toggleSideCol = () => {
  if (this.state.sideCol === 'menu') {
    this.setState({sideCol: 'filter'})
  } else {
    this.setState({
      sideCol: 'menu',
      // filter: {
      //   field: null,
      //   key: null,
      //   value: null
      // }
    })
  }

}
menuSelect = (args) => {
  this.setState({menuSelect: args})
}
submitFilterForm = (event) => {
  event.preventDefault();
  let field = event.target.field.value;
  let key = event.target.key.value;
  let value = event.target.value.value;
  if (value === 'true') {
    value = true
  }
  if (value === 'false') {
    value = false
  }
  this.setState({
    filter: {
      field: field,
      key: key,
      value: value
    }
  })

}
startAdd = (args) => {
  this.setState({
    adding: {
      state: true,
      field: args
    }
  })
}
cancelAdd = () => {
  this.setState({
    adding: {
      state: null,
      field: null
    }
  })
}

render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <Container className="profilePageContainer">
      <Row className="profilePageContainerRow headRow">
        <Col md={9} className="profilePageContainerCol">
          <h1>Staff Detail</h1>
        </Col>
        <Col md={3} className="profilePageContainerCol">
          {this.state.isLoading ? (
            <Image src={loadingGif} className="loadingGif" fluid />
          ):(
            <h4>x</h4>
          )}
        </Col>
      </Row>

      <Row className="profilePageContainerRow mainRow">
        <Col md={2} className="profilePageContainerCol">

        </Col>
        <Col md={10} className="profilePageContainerCol">
          {
            !this.state.detailedUser && (
              <h3>...</h3>
            )
          }
          {
            this.state.detailedUser && (
              <h3>{this.state.detailedUser.username}</h3>
            )
          }
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="profilePageContainerRow mainRow2">
          <Col md={2} className="profilePageContainerCol specialCol1">

          </Col>

          {this.state.detailedUser && (
            <Col md={10} className="profilePageContainerCol specialCol2">

              <h3> xxx </h3>

            </Col>
          )}

        </Row>
      </Tab.Container>
    </Container>
    </React.Fragment>
  );

}


}

export default UserDetail;
