import React, { Fragment } from "react";
import "./Header.scss";

const Header = () => {
  return (
    <Fragment>
      <div className="header">
        <div className="header__start">
          <a>
            <div>
              <img
                className="image"
                src="https://lh3.googleusercontent.com/p/AF1QipOW-tu4rs24nWhsGKigRk2UAR_ycguW0CaTABCq=s1360-w1360-h1020"
                alt=""
              />
            </div>
            <div className="logo__name">
              <span>UB Realty</span>
            </div>
          </a>
        </div>
        <div className="header__middle">hi</div>
        <div className="header__end">hi</div>
      </div>
    </Fragment>
  );
};

export default Header;
