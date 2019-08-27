import React from 'react';
import './App.css';
import Details  from './Details.js';
import SingleGridComponent from './SingleGridComponent.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
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

  backHandler = () => {
    this.setState({
        error: null,
        isLoaded: false,
        items: [],
        currentPage: 'grid',
        selectedTitle: '',
        selectedTitleUrl: ''
      }
    );
  }

  clickHandler = (title, url, id) => {
    this.setState({currentPage: 'details', selectedTitle: title, selectedTitleUrl: url, selectedId: id});
  }

  render() {
    const { error, isLoaded, items, currentPage, selectedTitle, selectedTitleUrl, selectedId } = this.state;

    if(currentPage === 'grid') {
      if (error) {
        return <div>{error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
        <div className="grid">
          {items.map(item => (
            <SingleGridComponent key={item.id} image={item.coverImage.large}
                      name={item.title.english}
                      id={item.id}
                      onClick={this.clickHandler} />
          ))}
        </div>
      );
      }
    } else if(currentPage === 'details') {
      return <Details title={selectedTitle} url={selectedTitleUrl} id={selectedId} backHandler={this.backHandler}/>;
    }

  }
}

export default App;
