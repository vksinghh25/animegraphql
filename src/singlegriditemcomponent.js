import React from 'react';

class SingleGridItemComponet extends React.Component {
  render() {
    return(
      <div className="grid__flex">
        <div><b> {this.props.name} </b></div>
        <img className="grid__img" alt={this.props.id} src={this.props.image} />
      </div>
    );
  }
}

export default SingleGridItemComponet;
