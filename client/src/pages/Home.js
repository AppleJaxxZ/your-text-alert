import React, { useEffect, useState, useContext } from 'react';
import PriceCard from '../components/cards/PriceCard';
import axios from 'axios';
import { UserContext } from '../context';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';


const Home = ({ history }) => {
  const [state, setState] = useContext(UserContext);
  const [prices, setPrices] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);



  useEffect(() => {
    let target = window.location.hash;
    target && document.querySelector(target).scrollIntoView()
  })

  useEffect(() => {
    if (!isEmpty(state)) {
      if (!isEmpty(state.user)) {
        setUserSubscriptions(state.user.subscriptions);
      }

    }
  }, [state]);



  useEffect(() => {

    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    const { data } = await axios.get('/api/prices');

    setPrices(data);
  };

  const handleClick = async (e, price) => {
    e.preventDefault();

    //Save this for later user...its supposed to redirect you to the plans ACCESS PAGE if clicked from home while logged in.
    if (userSubscriptions && userSubscriptions.includes(price.id)) {
      history.push(`/${price.nickname.toLowerCase()}`);
      return;
    }
    if (state && state.token) {
      const { data } = await axios.post(
        '/api/create-subscription',
        {
          priceId: price.id,
        }
      );
      window.open(data);
    } else {
      history.push('/register');
    }
  };



  return (
    <div className="container-fluid">
      <div className="row col-md-6 offset-md-3 text-center">
        <h1 className="pt-5 fw-bold">
          Are you tired of forgetting to call into Aver-Health every day?
        </h1>
        <p className="lead pb-4">
          Here's the solution. 3rd party app, made to make your life easier.
        </p>
        <p>
          Your daily text alert lets Aver-Health, Parole Officers, Recovery
          Court Officers/Systems know that you called in every day.
        </p>
        <p>
          Calling in everyday is a hassle. We know. Many of us would forget day
          to day and end up missing appointments...Lets end that now, build a
          better attendence record and always have a record on our phones of
          days we did or didnt have appointments
        </p>
        <p className="lead pb-4">
          Your text alert is sent around 9:05pm Est time everynight. It includes
          your Aver-Health locations hours of operations, confirmation number,
          testing location, and often closure days.
        </p>
      </div>

      <div id="plans1" className="row  pt-5 mb-3 text-center">
        <h4>Your Card will be charged automatically every month, if you delete or cancel your subscription it will still run until the end of the subscription month. ALL SALES ARE FINAL.</h4>
        {/*Second Row*/}

        {userSubscriptions.length === 0 ?
          prices.map((price) => (
            <PriceCard
              key={price.id}
              price={price}
              handleSubscription={handleClick}
              userSubscriptions={userSubscriptions}
            />
          )) : <h1>You already have a subscription, head to your <Link to='/account'>account</Link>  page to view your change your subscription.</h1>}

      </div>
    </div>
  );
};

export default Home;
