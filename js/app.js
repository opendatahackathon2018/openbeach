const App = {
  PAGES: {
    LOADER: 'loader',
    LIST: 'list',
    ITEM: 'item',
  },

  state: {
    page: 'list',
    beaches: [],
    beachId: null,
  },

  setState: state => {
    $.extend(App.state, state);

    console.log('setState', App.state);

    App.render();
  },

  fetchData: () => {
    const promise = $.get('beaches.json');

    return promise
      .fail((...data) => {
        console.log('fail', ...data);
      });
  },

  init: () => {
    // Set handlers
    $('#page-item button.map').on('click', App.onMapButtonClick);
    $('nav').on('click', App.onNavBarClick);

    App.setState({ page: App.PAGES.LOADER });

    App
      .fetchData()
      .then(data => {
        console.log({ data });

        App.setState({
          page: App.PAGES.LIST,
          beaches: data,
        });
      });
  },

  showPage: page => {
    $('.page').hide();
    $(`#page-${page}`).show();
  },

  onBeachItemClick: event => {
    const { beachId } = $(event.target).data();

    App.setState({
      page: App.PAGES.ITEM,
      beachId,
    });
  },

  onNavBarClick: () => {
    App.setState({
      page: App.PAGES.LIST,
      beachId: null,
    });
  },

  onMapButtonClick: () => {
    const beachId = App.state.beachId;
    const beach = App.getBeachById(beachId);
    const [lat, lon] = beach.location;
    const url = `https://www.google.com/maps/place/${lat},${lon}`;

    window.open(url);
  },

  getBeachById: id => {
    return App.state.beaches.find(item => item.id === id);
  },

  replacePlaceholders: (element, placeholders) => {
    const html = element
      .html()
      .replace(/%[\w\\.]+%/g, id => placeholders[id] || id);

    element.html(html);
  },

  render: () => {
    const backButton = $('nav button.back');

    switch (App.state.page) {
      case App.PAGES.LIST: {
        const beachList = $('#page-list .beach-list');
        const beachItemTemplate = $('#beach-list-item li');

        // Clear list
        beachList.html('');

        $.each(App.state.beaches, (i, beach) => {
          const beachItem = beachItemTemplate.clone();
          beachItem.data('beachId', beach.id);
          beachItem.text(beach.name);
          beachItem.on('click', App.onBeachItemClick);
          beachItem.appendTo(beachList);
        });

        App.showPage(App.PAGES.LIST);
        backButton.hide();
        break;
      }

      case App.PAGES.ITEM: {
        const page = $('#page-item');
        const titleContainer = page.find('h2');
        const airContainer = page.find('.air');
        const waterContainer = page.find('.water');
        const photosContainer = page.find('.photos');
        const airTemplate = $('#beach-item-air');
        const waterTemplate = $('#beach-item-water');

        const beachId = App.state.beachId;
        const beach = App.getBeachById(beachId);

        titleContainer.text(beach.name);


        let windDirectionIcon;

        switch (beach.air.windDirection) {
          case 'N': {
            windDirectionIcon = '↑';
            break;
          }
          case 'NE': {
            windDirectionIcon = '↗';
            break;
          }
          case 'E': {
            windDirectionIcon = '→';
            break;
          }
          case 'SE': {
            windDirectionIcon = '↘';
            break;
          }
          case 'S': {
            windDirectionIcon = '↓';
            break;
          }
          case 'SW': {
            windDirectionIcon = '↙';
            break;
          }
          case 'W': {
            windDirectionIcon = '←';
            break;
          }
          case 'NW': {
            windDirectionIcon = '↖';
            break;
          }
        }

        airContainer.html(airTemplate.html());
        App.replacePlaceholders(airContainer, {
          '%air.temperature%': beach.air.temperature,
          '%air.humidity%': beach.air.humidity,
          '%air.windSpeed%': beach.air.windSpeed,
          '%air.windDirection%': `${beach.air.windDirection} ${windDirectionIcon}`,
          '%air.pollution%': beach.air.pollution,
        });

        waterContainer.html(waterTemplate.html());
        App.replacePlaceholders(waterContainer, {
          '%water.temperature%': beach.water.temperature,
          '%water.pollution%': beach.water.pollution,
        });

        if (beach.photos) {
          const photosList = photosContainer.find('ul');
          const photoItemTemplate = $('#beach-item-photo > li');

          photosList.html('');

          $.each(beach.photos, (i, url) => {
            const photoItem = photoItemTemplate.clone();
            photoItem.find('img').prop('src', url);
            photoItem.appendTo(photosList);
          });

          photosContainer.show();
        } else {
          photosContainer.hide();
        }

        App.showPage(App.PAGES.ITEM);
        backButton.show();
        break;
      }
    }

    console.log({ state: App.state });
  },
};

$(() => {
  App.init();
});
