import React from 'react';
import './App.css';
import axios from 'axios';
import SingleGridItemComponet from './singlegriditemcomponent.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
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
    const variables = {};
    // We call the method here to execute our async function
    this.getAnime(query, variables)
  }

  // arrow function is now the preferred way to write functions inside the class
  getAnime = async (query, variables) => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query,
        variables
      });

      // Log the response so we can look at it in the console
      console.log(response.data)

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

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>{error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

      return (
      <div className="grid">
        {items.map(item => (
          <SingleGridItemComponet key={item.id} image={item.coverImage.large} name={item.title.english} />
        ))}
      </div>
    );
    }
  }
}

export default App;
