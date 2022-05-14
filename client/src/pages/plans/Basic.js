import React, { Fragment, useEffect, useContext } from 'react';
import { UserContext } from '../../context';

const Basic = ({ history, match }) => {
  const [state, setState] = useContext(UserContext);
  console.log('state', state);
  useEffect(() => {
    let result = [];
    const check = () =>
      state &&
      state.user &&
      state.user.subscriptions &&
      state.user.subscriptions.map((sub) => {
        result.push(sub.plan.nickname);
      });
    check();
    const plan = match.path.split('/')[1].toUpperCase(); //basic
    if (!result.includes(plan)) {
      history.push('/');
    }
  }, [state && state.user]);
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row py-5 bg-light text-center">
          <h1 className="display-4 fw-bold">BASIC</h1>
          <p className="lead">Here are your plans features</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-8 p-5 rounded bg-dark text-light">
            <ul className="lead">
              <li>Nightly Message Alerts at 9:05pm </li>
              <li>More comming soon</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Email Support</h4>
            <p>easylandings.software@gmail.com</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Basic;
