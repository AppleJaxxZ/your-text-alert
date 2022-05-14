import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UserContext } from '../context';
import moment from 'moment';
import toast from 'react-hot-toast';

const Account = ({ history }) => {
  const [state, setState] = useContext(UserContext);
  const [subscriptions, setSubscriptions] = useState([]);

  const logout = () => {
    setState({ user: {}, token: "" })
    localStorage.removeItem('auth');
    history.push('/login')
  }



  useEffect(() => {
    const getSubscriptions = async () => {
      const { data } = await axios.get('/api/subscriptions')

      setSubscriptions(data.subscriptions.data)
    }
    if (state && state.token) getSubscriptions()
  }, [state && state.token])

  const manageSubscriptions = async () => {
    const { data } = await axios.get(
      '/api/customer-portal'
    );
    window.open(data);
  };

  const deleteUser = async () => {
    var config = {
      method: 'delete',
      url: '/api/deleteUser',
      data: state.user,
    };

    await axios(config)
      .then((res) => {
        toast.success(res.data);
        setTimeout(() => {
          logout();
        })
      })
      .catch((err) => {
        toast.error('Account was not deleted. Please contact support.');
        console.log(err);
      });
  };
  return (
    <div className="container">
      <div className="row">
        <UserOutlined className="display-4" />
        <h2>User Details:</h2>
        <p className="lead pb-4"><b>Username:</b> {state.user.name}</p>
        <p><b>Email: </b>{state.user.email}</p>
        <p><b>Phone Number:</b> {state.user.phoneNumber}</p>
        <p><b>AverHealth Pin: </b>{state.user.pinNumber}</p>
        <p> <b>Date Of Birth:</b> {state.user.dateOfBirth}</p>
        {/* <p>See Somthing Wrong?  Make sure your user details are correct before purchasing a subscription! </p><Link className="mb-5" to='/updateUser'>Update User Credentials</Link> */}

        <h2>Account</h2>
        <p className="lead pb-4">Subscription Status</p>

        {/* <p>{JSON.stringify(subscriptions)}</p> */}
        {/* <p>{JSON.stringify(state.user)}</p> */}

      </div>

      <div className="row">
        {subscriptions &&
          subscriptions.map((sub) => (
            <div key={sub.id}>
              <section>
                <hr />
                <h4 className="fw-bold">{sub.plan.nickname}</h4>
                <h5>
                  {(sub.plan.amount / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: sub.plan.currency,
                  })}
                </h5>
                <p>Status: {sub.status}</p>
                <p>
                  Card last 4 digits: {sub.default_payment_method ? sub.default_payment_method.card.last4 : <p>Multiple Cards Found, click 'Manage Subscription to add or remove cards</p>}
                </p>
                <p>
                  Current period end:{' '}
                  {moment(sub.current_period_end * 1000)
                    .format('dddd, MMMM, Do YYYY h:mm:s a')
                    .toString()}
                </p>
                <button
                  className=" btn btn-outline-danger"
                  onClick={() =>
                    history.push(`/${sub.plan.nickname.toLowerCase()}`)
                  }
                >
                  Access
                </button>{' '}
                <button
                  onClick={manageSubscriptions}
                  className=" btn btn-outline-warning"
                >
                  Manage Subscription
                </button>
              </section>
            </div>
          ))}


        <button
          type="button"
          onClick={deleteUser}
          className="btn btn-danger btn-sm mt-5 mb-5"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Account;
