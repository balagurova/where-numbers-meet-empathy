import { useState, useEffect } from 'react';
import Card from './components/card';
import FilterWithTooltip from './components/FilterWithTooltip';
import data from './components/data.json';
import { Box, Typography } from '@mui/material';

const App = () => {
    const [cards, setCards] = useState([]);
    const [category, setCategory] = useState('all');
    const [author, setAuthor] = useState('all');
    const [layer, setLayer] = useState('all');
    const [strategy, setStrategy] = useState('all');

    useEffect(() => {
        setCards(data);
    }, []);

    const filterOptions = {
        category: [...new Set(data.map((card) => card.category))],
        author: [...new Set(data.map((card) => card.author))],
        layer: [...new Set(data.map((card) => card.layer))],
        strategy: [...new Set(data.map((card) => card.strategy))]
    };

    const filteredCards = cards.filter(card => (
        (category === 'all' || card.category === category) &&
        (author === 'all' || card.author === author) &&
        (layer === 'all' || card.layer === layer) &&
        (strategy === 'all' || card.strategy === strategy)
    ));

    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
          Where Data Meets Empathy
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
          <FilterWithTooltip
              label="Category"
              options={filterOptions.category}
              value={category}
              handleChange={setCategory}
              tooltipText="Filter by Category"
          />
          <FilterWithTooltip
              label="Author"
              options={filterOptions.author}
              value={author}
              handleChange={setAuthor}
              tooltipText="Filter by Author"
          />
          <FilterWithTooltip
              label="Layer"
              options={filterOptions.layer}
              value={layer}
              handleChange={setLayer}
              tooltipText="Filter by Layer"
          />
          <FilterWithTooltip
              label="Strategy"
              options={filterOptions.strategy}
              value={strategy}
              handleChange={setStrategy}
              tooltipText="Filter by Strategy"
          />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          {filteredCards.map(card => (
              <Card
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  link={card.link}
              />
          ))}
      </Box>
  </Box>
);
};

export default App;