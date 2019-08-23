import React from 'react';
import './Details.css';

class Details extends React.Component {
  render() {
    console.log(this.props.title);
    return(
      <div>
        <div className="split left">
            <img src={this.props.url} />
        </div>
        <div className="split right">
          <div className="centered vertically horizontally">
            <h1> {this.props.title} </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
