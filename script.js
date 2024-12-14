// Load JSON data
d3.json('projects.json').then((data) => {
  // Define strategies for the four columns
  const strategyCategories = [
    'Sensations',
    'Narrative',
    'Behaviour',
    'Context',
  ];

  // Initialize a dictionary to store techniques grouped by strategies
  const techniquesByStrategy = {
    Sensations: new Set(),
    Narrative: new Set(),
    Behaviour: new Set(),
    Context: new Set(),
  };

  // Track selected filters
  let selectedFilters = {};

  // Extract techniques from all layers and group them by strategies
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

  // Convert Sets to Arrays for easier rendering
  for (const strategy in techniquesByStrategy) {
    techniquesByStrategy[strategy] = Array.from(techniquesByStrategy[strategy]);
  }

  // Populate the UI with techniques divided into 4 columns based on strategies
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

            // Toggle the active class
            element.classed('active', !isActive);

            // Add or remove the filter from selectedFilters
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

            // Apply filters
            applyFilters();
          });
      });
    });
  }

  // Render projects based on selected filters
  function renderProjects(filteredProjects) {
    const gallery = d3.select('#project-gallery');
    gallery.html(''); // Clear existing cards

    const cards = gallery
      .selectAll('.card')
      .data(filteredProjects)
      .enter()
      .append('div')
      .attr('class', 'card');

    // Add image
    cards
      .append('img')
      .attr('src', (d) => d.image)
      .attr('alt', (d) => d.title);

    // Add title
    cards.append('h3').text((d) => d.title);

    // Add authors
    cards
      .append('p')
      .attr('class', 'authors')
      .text((d) => `by ${d.authors}`);

    // Add container for links
    const linkContainer = cards.append('div').attr('class', 'link-container');

    // Add "View Project" link
    linkContainer
      .append('a')
      .attr('class', 'button-with-brackets')
      .attr('href', (d) => d.link)
      .attr('target', '_blank')
      .text('View Project');

    // Add "Read More" link
    linkContainer
      .append('a')
      .attr('class', 'button-with-brackets')
      .attr('href', '#')
      .text('Read more')
      .on('click', (event, d) => {
        event.preventDefault(); // Prevent default link Behaviour
        openModal(d); // Pass the project data to the modal
      });
  }

  // Filter projects based on selected filters
  function applyFilters() {
    const filteredProjects = data.filter((project) => {
      return Object.entries(selectedFilters).every(([strategy, techniques]) => {
        // Ensure all selected techniques in this strategy match
        return Object.values(project.layers || {}).some((layer) => {
          const projectTechniques = layer[strategy] || [];
          return Array.from(techniques).every((technique) =>
            projectTechniques.includes(technique)
          );
        });
      });
    });

    // Render filtered projects
    renderProjects(filteredProjects);
  }

  // Modal logic (unchanged)
  function setupModal() {
    const modal = d3.select('#modal');
    const modalContent = d3.select('.modal-body');
    const closeButton = d3.select('.close-button');

    // Open modal
    function openModal(project) {
      modalContent.html(''); // Clear previous content

      modalContent
        .append('img')
        .attr('src', project.image)
        .attr('alt', project.title)
        .style('max-width', '100%')
        .style('margin-bottom', '20px');

      modalContent.append('h2').text(project.title);
      modalContent.append('p').text(project.description);

      modal.style('display', 'flex'); // Ensure modal becomes visible
    }

    // Close modal
    closeButton.on('click', () => modal.style('display', 'none'));

    return openModal;
  }

  const openModal = setupModal();

  // Populate techniques and render all projects initially
  populateColumns();
  renderProjects(data);
});
