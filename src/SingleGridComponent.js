import React from 'react';

class SingleGridComponent extends React.Component {
  render() {
    return(
      <div className="grid__flex">
        <div><b> {this.props.name} </b></div>
        <img className="grid__img" alt={this.props.id}
                  src={this.props.image}
                  onClick={() => this.props.onClick(this.props.name, this.props.image, this.props.id)} />
      </div>
    );
  }
}

export default SingleGridComponent;
