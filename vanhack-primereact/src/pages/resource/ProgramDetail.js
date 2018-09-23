import React, {Component} from 'react';
import {Link} from 'react-router-dom';
// import { connect } from 'react-redux';
import './ProgramDetail.css'
import dot from 'dot-prop'
import axios from 'axios'
import {Dialog} from 'primereact/dialog';

class ProgramDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      program: {},
      applyList: null,
      listWithUser: [],
    };

  }
  componentDidMount() {
    this.queryProgram();
    this.queryApplyList();
    this.queryListWithUser();
  }


  async queryListWithUser() {
    const {programId} = this.props;
    const a = await axios.post(`${window.SERVER_ROOT_URL}/biz/relation/queryUserList`, {
      programId
    });
    const err = dot.get(a, 'data.err');
    if (err) {
      this.setState({applyList: null});
    } else {
      const listWithUser = dot.get(a, 'data.apply_lists');
      console.log(listWithUser);
      this.setState({listWithUser});
    }
  }
  async queryApplyList() {
    const {programId} = this.props;
    const a = await axios.post(`${window.SERVER_ROOT_URL}/biz/relation/checkRelation`, {
      programId
    });
    const err = dot.get(a, 'data.err');
    if (err) {
      this.setState({applyList: null});
    } else {
      const applyList = dot.get(a, 'data.apply_list');
      this.setState({applyList});
    }
  }

  async queryProgram() {
    const {programId} = this.props;
    const a = await axios.get(`${window.SERVER_ROOT_URL}/biz/program/queryOne?id=` + programId);
    const err = dot.get(a, 'data.err');
    // console.log(a);
    if (err) {
      // this.showAlert();
    } else {
      const program = dot.get(a, 'data.program');
      this.setState({program});
    }
  }

  onSubmit(values) {
    console.log(values);
    // this.props.staffLogin(values.username, values.password, ()=> {
    //   console.log('submit callback');
    // });
  }

  async onClickApply() {
    const {programId} = this.props;
    const a = await axios.post(`${window.SERVER_ROOT_URL}/biz/relation/registerProgram`, {
      programId
    });
    const err = dot.get(a, 'data.err');
    if (err) {
      //TODO show err
    } else {
      const applyList = dot.get(a, 'data.apply_list');
      this.setState({applyList});
    }
  }

  applyResultToString(r) {
    if (r === 0) {
      return "Waiting for process";
    } else if (r === 1) {
      return "Confirmed";
    } else {
      return "Rejected";
    }
  }

  renderApplyBtn() {
    const {user} = this.props;
    if (this.state.applyList) {
      return (
          <div>
            <p>You have apply this program, result: {this.applyResultToString(this.state.applyList.result)}</p>
          </div>
      );
    } else {
      if (user && user.type === 0) {
        return (
            <div>


              <div>
                <button onClick={this.onClickApply.bind(this)}>Apply For It!</button>
              </div>
            </div>

        );
      } else if (user && user.type === 1) {
        return (
            <div>
              <button onClick={this.onClickApply.bind(this)}>Be A Volunteer For It!</button>
            </div>
        );
      } else {
        return null;
      }
    }

  }

  render() {
    // const { handleSubmit } = this.props;
    return (
        <div>
          <div className={"introduction"}>
          <h1>Program details - {this.state.program.name}</h1>
            <div>Details of the program</div>
          </div>

          <div className={"program"}>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Program Name</h3>
              <div>{this.state.program.name}</div>
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Program Description</h3>
              <div>{this.state.program.desc}</div>
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Program Website</h3>
              <div>{this.state.program.web}</div>
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Application Requirement</h3>
              <div>{this.state.program.desc}</div>
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Location</h3>
              <div>{this.state.program.desc}</div>
              {/*<img src={""}>Google Map</img>*/}
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Application Deadline</h3>
              <div>{this.state.program.desc}</div>
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Positions Avaialble for teenage/students</h3>
              <div>{this.state.program.desc}</div>
            </div>

            <div className={"programRow"}>
              <h3 className={"head-program-row"}>Volunteers needed</h3>
              <div>{this.state.program.desc}</div>
            </div>







            <div>{this.renderApplyBtn()}</div>

            <div></div>


          </div>

        </div>
    )
  }

  async changeApplyListState(l, s) {
    const a = await axios.post(`${window.SERVER_ROOT_URL}/biz/relation/updateResult`, {
      applyListId: l._id,
      result: s,
    });
    this.queryListWithUser();
  }

  renderApplicationList() {
    const {user} = this.props;
    if (user && user.type === 2) {
      const e = this.state.listWithUser.map((l) => {
        const {userRef} = l;
        return (
            <div key={l._id}>
              <span>{userRef.username},</span>
              <span>{userRef.type === 0 ? 'Teen' : 'Volunteer'}</span>
              {
                l.result == 0? (
                    <span>
                      <button onClick={()=>{this.changeApplyListState(l, 1)}}>Confirm</button>
                      <button onClick={()=>{this.changeApplyListState(l, 2)}}>Reject</button>
                    </span>
                ) : (
                    <span>
                      ,{this.applyResultToString(l.result)}
                      </span>
                )
              }

            </div>
        )
      });
      return (
          <div>
            <div>Application List:</div>
            {e}
          </div>
      );
    } else {
      return (
          <div>
          </div>
      );
    }
  }
}


export default ProgramDetailPage;



