import React from 'react';
import './App.css';
import Details  from './Details.js';
import SingleGridComponent from './SingleGridComponent.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      items: [],
      currentPage: 'grid',
      selectedTitle: '',
      selectedTitleUrl: ''
    }
  }

  componentDidMount() {
    // This is the GraphQL query
    const query = `
    query {
      Page {
        media(isAdult: false, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
    `;

    // These variables are optional, leave empty for now
    // const variables = {};
    // We call the method here to execute our async function
    // this.getAnime(query, variables)
    // just for kicks, let's do this using fetch as  well
    fetch('https://graphql.anilist.co/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      })
      .then(response => {
        return response.json()
      })
      .then(responseAsJson => {
        this.setState({ isLoaded: true, items: responseAsJson.data.Page.media });
      })
  }

  componentDidUpdate(prevProps, prevState) {
    // This is the GraphQL query
    if(!this.state.isLoaded) {
      const query = `
      query {
        Page {
          media(isAdult: false, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
          }
        }
      }
      `;

      // These variables are optional, leave empty for now
      // const variables = {};
      // We call the method here to execute our async function
      // this.getAnime(query, variables)
      // just for kicks, let's do this using fetch as  well
      fetch('https://graphql.anilist.co/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
          }),
        })
        .then(response => {
          return response.json()
        })
        .then(responseAsJson => {
          this.setState({ isLoaded: true, items: responseAsJson.data.Page.media });
        })
    }
  }

  // method to be called when on the Details page, you try to get back to the grid Page
  // clear all the fields and this once again re-renders the component
  backHandler = () => {
    this.setState({
        isLoaded: false,
        items: [],
        currentPage: 'grid',
        selectedTitle: '',
        selectedTitleUrl: ''
      }
    );
  }

  // method to be called when an image is clicked
  imageClickHandler = (title, url, id) => {
    // now we want to open the the Details page
    // also note that this is in a way routing, based on the value of currentPage
    // this sets the state and the render method is called again
    // since we are setting the state, the component is going to re-render
    this.setState({currentPage: 'details', selectedTitle: title, selectedTitleUrl: url, selectedId: id});
  }

  render() {
    const { isLoaded, items, currentPage, selectedTitle, selectedTitleUrl, selectedId } = this.state;

    if(currentPage === 'grid') {
      if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
        <div>
        <h1 className="centered"> AniList </h1>
        <div className="grid">
          {items.map(item => (
            <SingleGridComponent key={item.id} image={item.coverImage.large}
                      name={item.title.english}
                      id={item.id}
                      onClick={this.imageClickHandler} />
          ))}
        </div>
        </div>
      );
      }
    } else if(currentPage === 'details') {
      // rende
      return <Details title={selectedTitle} url={selectedTitleUrl} id={selectedId} backHandler={this.backHandler}/>;
    }

  }
}

export default App;
