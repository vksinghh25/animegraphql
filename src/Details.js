import React from 'react';
import './Details.css';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: []
    }
  }

  componentDidMount() {
    //this time we load the id that has been chosen
    fetch('https://graphql.anilist.co/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query($id: Int) {
              Page {
                media(id: $id) {
                  id
                  title {
                    romaji
                    english
                  }
                  description(asHtml: false)
                  countryOfOrigin
                  type
                  coverImage {
                    large
                  }
                }
              }
            }
          `,
          variables: {
            count: parseInt(this.props.id),
          },
        }),
      })
      .then(response => {
        return response.json()
      })
      .then(responseAsJson => {
        console.log(responseAsJson.data);
        this.setState({item: responseAsJson.data.Page.media});
      })
  }

  render() {
    return(
      <div>
        <div className="split left">
            <img src={this.props.url} alt={this.props.title}/>
        </div>
        <div className="split right">
          <div className="centered vertically">
            <h1> {this.props.title} </h1>
            <p> {this.state.item[0] && this.state.item[0].description} </p>
            <p> {this.state.item[0] && this.state.item[0].countryOfOrigin} </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
