import React from 'react';
import './Details.css';
import { Button, Popover, OverlayTrigger, Image, Row } from 'react-bootstrap';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      popoverOpen: false,
      isLoaded: false
    }
  }

  // arrow function
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  componentDidMount() {
    console.log("Inside componentDidMount");
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
                  meanScore
                  genres
                  title {
                    romaji
                    english
                  }
                  characters {
                    nodes {
                      id
                      description(asHtml: false)
                      image {
                        medium
                      }
                      name {
                        full
                        native
                      }
                    }
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
            id: parseInt(this.props.id),
          },
        }),
      })
      .then(response => {
        return response.json()
      })
      .then(responseAsJson => {
        console.log(responseAsJson.data);
        this.setState({item: responseAsJson.data.Page.media, isLoaded: true});
      });
  }

  render() {
    console.log("Calling Details with id : " + this.props.id);
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    }
    else {
      return(
          <section className="intro">
          <Row>
            <div className="centered vertically">
              <h1> {this.props.title} </h1>
              <p> {this.state.item[0] && 'Score: ' + this.state.item[0].meanScore + '/100'} </p>
              <p> {this.state.item[0] && this.state.item[0].description} </p>
              <p><b> {this.state.item[0] && 'Country of Origin:  ' + this.state.item[0].countryOfOrigin} </b></p>
              <p>
                {this.state.item[0] && this.state.item[0].genres.map(genre => (
                  <span key={genre} className="badge badge-secondary">{genre}</span>
                ))}
              </p>
            </div>
          </Row>
          <Row>
          <div className="col-lg-6 col-sm-12 left">
              <img className="stretch" src={this.props.url} alt={this.props.title}/>
          </div>

          <div className="col-lg-6 col-sm-12 right">

            <div className="centered vertically">
              <p>
                {this.state.item[0] && this.state.item[0].characters.nodes.map(node => (
                    <span key={node.id}>
                    <OverlayTrigger trigger="hover" placement="top" overlay={
                      <Popover id={node.id}>
                        <Popover.Title as="h3">{node.name.native}</Popover.Title>
                        <Popover.Content>
                          {node.name.full}
                        </Popover.Content>
                      </Popover>
                    }>
                      <Image className="tiny" id={node.id} alt={node.name.full} src={node.image.medium} thumbnail/>
                    </OverlayTrigger>
                    </span>
                ))}
              </p>

              <p> {this.state.item[0] && <Button type="button" className="btn btn-primary" onClick={this.props.backHandler}>Back</Button>}</p>
            </div>

          </div>
        </Row>
        </section>
      );
    }
  }
}

export default Details;
