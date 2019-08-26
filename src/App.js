import React from 'react';
import './App.css';
import axios from 'axios';
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

  // arrow function is now the preferred way to write functions inside the class
  // async/await is just a better way of writing the promise based code
  // it helps you write and visualise asyncronous code in sync manner
  getAnime = async (query, variables) => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query,
        variables
      });

      // Log the response so we can look at it in the console
      console.log(response.data)

      // either this would be set into the state
      // or the error would be set into the state
      // whenever that happens, the render function is called
      // Set the data to the state
      this.setState(() => ({
        isLoaded: true,
        items: response.data.data.Page.media
      }));
    } catch (error) {
      // If there's an error, set the error to the state
      this.setState(() => ({ error }))
    }
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
      return <Details title={selectedTitle} url={selectedTitleUrl} id={selectedId}/>;
    }

  }
}

export default App;
