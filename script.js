const layerTypes = ['Data layer', 'Graph layer', 'Story layer'];
const selectedLayers = new Set(layerTypes);

d3.json('projects.json').then((data) => {
  const strategyCategories = [
    'Sensations',
    'Narrative',
    'Behaviour',
    'Context',
  ];
  const techniquesByStrategy = {
    Sensations: new Set(),
    Narrative: new Set(),
    Behaviour: new Set(),
    Context: new Set(),
  };
  let selectedFilters = {};

  data.forEach((project) => {
    Object.values(project.layers || {}).forEach((strategies) => {
      Object.entries(strategies || {}).forEach(([strategy, techniques]) => {
        if (techniquesByStrategy[strategy]) {
          techniques.forEach((technique) => {
            techniquesByStrategy[strategy].add(technique);
          });
        }
      });
    });
  });

  function applyFilters() {
    const filteredProjects = data.filter((project) => {
      const projectLayers = Object.keys(project.layers || {});
      const matchesLayer = projectLayers.some((layer) =>
        selectedLayers.has(layer)
      );
      if (!matchesLayer) return false;

      return Object.entries(selectedFilters).every(([strategy, techniques]) =>
        Object.entries(project.layers || {}).some(([layerName, layer]) => {
          if (!selectedLayers.has(layerName)) return false;
          const projectTechniques = layer[strategy] || [];
          return Array.from(techniques).every((technique) =>
            projectTechniques.includes(technique)
          );
        })
      );
    });

    renderProjects(filteredProjects);
  }

  for (const strategy in techniquesByStrategy) {
    techniquesByStrategy[strategy] = Array.from(techniquesByStrategy[strategy]);
  }

  function populateLayerFilter() {
    const container = d3
      .select('.grid')
      .insert('div', ':first-child')
      .attr('id', 'techniques-layers')
      .attr('class', 'filter-list');

    container.append('h3').text('Data Layers');

    const list = container.append('ul');

    layerTypes.forEach((layer) => {
      list
        .append('li')
        .text(layer)
        .attr('data-filter', layer)
        .classed('active', true)
        .on('click', function () {
          const el = d3.select(this);
          const isActive = el.classed('active');
          el.classed('active', !isActive);

          if (isActive) {
            selectedLayers.delete(layer);
          } else {
            selectedLayers.add(layer);
          }

          applyFilters();
        });
    });
  }

  function populateColumns() {
    strategyCategories.forEach((strategy) => {
      const column = d3.select(`#techniques-${strategy.toLowerCase()} ul`);
      const techniques = techniquesByStrategy[strategy];
      techniques.forEach((technique) => {
        column
          .append('li')
          .text(technique)
          .attr('data-filter', technique)
          .on('click', function () {
            const element = d3.select(this);
            const isActive = element.classed('active');
            element.classed('active', !isActive);

            if (!isActive) {
              if (!selectedFilters[strategy]) {
                selectedFilters[strategy] = new Set();
              }
              selectedFilters[strategy].add(technique);
            } else {
              selectedFilters[strategy]?.delete(technique);
              if (selectedFilters[strategy]?.size === 0) {
                delete selectedFilters[strategy];
              }
            }

            applyFilters();
          });
      });
    });
  }

  function renderProjects(filteredProjects) {
    const gallery = d3.select('#project-gallery');
    gallery.html('');

    const cards = gallery
      .selectAll('.card')
      .data(filteredProjects)
      .enter()
      .append('div')
      .attr('class', 'card');

    cards
      .append('img')
      .attr('src', (d) => d.image)
      .attr('alt', (d) => d.title);

    const cardsContent = cards.append('div').attr('class', 'cardContent');

    cardsContent.append('h3').text((d) => d.title);
    cardsContent
      .append('p')
      .attr('class', 'authors')
      .text((d) => `by ${d.authors || d['published in']}`);

    cardsContent.each(function (d) {
      const chipContainer = d3
        .select(this)
        .append('div')
        .attr('class', 'technique-chips');

      let allTechniques = [];
      Object.entries(d.layers || {}).forEach(([strategy, techniques]) => {
        Object.entries(techniques || {}).forEach(([, techniqueList]) => {
          allTechniques = allTechniques.concat(techniqueList);
        });
      });

      allTechniques.slice(0, 5).forEach((technique) => {
        chipContainer.append('span').attr('class', 'tag').text(technique);
      });

      if (allTechniques.length > 5) {
        const hiddenTechniques = allTechniques.slice(5);

        chipContainer
          .append('span')
          .attr('class', 'tag more')
          .attr('style', 'cursor: pointer;')
          .text(`+${hiddenTechniques.length}`)
          .on('click', function () {
            hiddenTechniques.forEach((technique) => {
              chipContainer
                .append('span')
                .attr('class', 'tag additional')
                .text(technique);
            });

            // Remove the "+X" chip after appending the additional chips
            d3.select(this).remove();
          });
      }
    });

    const linkContainer = cards.append('div').attr('class', 'link-container');

    linkContainer
      .append('a')
      .attr('class', 'button-with-brackets')
      .attr('href', (d) => d.link)
      .attr('target', '_blank')
      .text('View Project');
  }

  populateLayerFilter();
  populateColumns();
  renderProjects(data);
});
