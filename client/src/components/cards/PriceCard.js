import React, { useContext } from 'react';
import { UserContext } from '../../context';

const PriceCard = ({ price, handleSubscription, userSubscriptions }) => {
  const [state] = useContext(UserContext);
  const dynamicDescription = () => {
    if (price.nickname === 'BASIC') {
      return '1 alert every night';
    } else if (price.nickname === 'STANDARD') {
      return '2 alerts- one the night before and one the monring of your scheduled test day.';
    } else if (price.nickname === 'PREMIUM') {
      return '3 alerts- one the night before your test, one the monring of your test, and one at 3pm day of your test as a reminder.';
    }
  };

  const buttonStyle = () => {
    return price.nickname === 'BASIC' ? 'btn-outline-danger' : 'btn-danger';
  };

  const headerStyle = () => {
    return price.nickname === 'BASIC' ? 'bg-danger text-light' : '';
  };

  const borderStyle = () => {
    return price.nickname === 'PREMIUM' ? 'border-danger' : '';
  };

  const buttonText = () => {
    return state && state.token ? 'Buy the plan' : 'Sign Up';
  };

  return (
    <div className="col">
      <div className={`card mb-4 routed-3 shadow-sm ${borderStyle()}`}>
        <div className={`card-header py-3 ${headerStyle()}`}>
          <h4 className="my-0 fw-normal">{price.nickname}</h4>
        </div>

        <div className="card-body">
          <h1 className="card-title pricing-card-title">
            {(price.unit_amount / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
            <small className="text-muted fw-light">/mo</small>
          </h1>
          <ul className="list-unstyled mt-3 mb-4">
            <li className="fw-bold">{dynamicDescription()}</li>
            <li>Keep Track Of Your Scheduled History!</li>
            <li>More free features comming soon!</li>
          </ul>
          {/* <pre>{JSON.stringify(price, null, 4)}</pre> */}

          <button
            onClick={(e) => handleSubscription(e, price)}
            className={`w-100 btn btn-lg ${buttonStyle()}`}
          >
            {userSubscriptions && userSubscriptions.includes(price.id)
              ? 'Access Plan'
              : buttonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
