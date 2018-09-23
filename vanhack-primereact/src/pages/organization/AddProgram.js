
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AddProgram.css'
import axios from 'axios'
import {Dialog} from 'primereact/dialog';
import dot from 'dot-prop'
import {
  withRouter
} from 'react-router-dom'

class AddProgramPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // alert
      alertVisible: false,

      // model
      name: '',
      desc: '',
      location: '',
      geo: { // TODO handle geo selection
        latitude: null,
        longitude: null
      },
      deadline: null,
      position_teen: 0,
      position_volunteer: 0,
      contact_name: '',
      contact_phone: '',
      field: 0,
    };

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  async submitBtnClicked() {
    // TODO verify input
    const {name, desc, location, geo, deadline, position_teen, position_volunteer, contact_name, contact_phone, field} = this.state;
    const r = {name, desc, location, geo, deadline, position_teen, position_volunteer, field};
    r.contact = {
      name: contact_name,
      phone: contact_phone
    };


    const a = await axios.post(`${window.SERVER_ROOT_URL}/biz/organization/addProgram`, r);
    const err = dot.get(a, 'data.err');
    if (err) {
      this.showAlert();
    } else {
      const program = dot.get(a, 'data.program');
      // console.log(program);
      // if (this.props.onRegister && user) {
      //   this.props.onRegister(user);
      // }
      this.props.history.push('/');
    }

    // this.props.staffLogin(values.username, values.password, ()=> {
    //   console.log('submit callback');
    // });
  }

  showAlert() {
    this.setState({
      alertVisible: true,
    })
  }

  onChangeText(e, key) {
    const c = {};
    c[key] = e.target.value;
    this.setState(c);
  }

  render () {
    const { handleSubmit } = this.props;
    return (
        <div>
          <Dialog header="Alert" visible={this.state.alertVisible} width="350px" modal={true} onHide={(e) => this.setState({alertVisible: false})}>
            Error
          </Dialog>

          <div>
            <span>Program Name:</span>
            <input type="text" value={this.state.name} onChange={(e) => {
              this.onChangeText(e, 'name')
            }}/>
          </div>


          <div>
            <span>Program Description:</span>
            <input type="text" value={this.state.desc} onChange={(e) => {
              this.onChangeText(e, 'desc')
            }}/>
          </div>


          <button onClick={this.submitBtnClicked.bind(this)}>submit</button>
        </div>
    )
  }
}

export default withRouter(AddProgramPage);


