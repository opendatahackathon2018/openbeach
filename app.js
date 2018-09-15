const dataMock = [
  {
    id: 1, // int
    name: 'Beach Name 1', // string
    location: [33.123456, 34.123456], // latitude, longitude
    air: {
      temperature: 33.4, // degrees, C
      humidity: 0.83, // percents, 83%
      windSpeed: 5, // meters per second
      windDirection: 240, // degrees, from North?
      pollution: 1, // int, 1 (min) to 4 (max)
    },
    water: {
      temperature: 25.6, // degrees, C
      pollution: 4, // int, 1 (min) to 4 (max)
    },
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ],
  },
  {
    id: 2, // int
    name: 'Beach Name 2', // string
    location: [33.123456, 34.123456], // latitude, longitude
    air: {
      temperature: 33.4, // degrees, C
      humidity: 0.83, // percents, 83%
      windSpeed: 5, // meters per second
      windDirection: 240, // degrees, from North?
      pollution: 1, // int, 1 (min) to 4 (max)
    },
    water: {
      temperature: 25.6, // degrees, C
      pollution: 4, // int, 1 (min) to 4 (max)
    },
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ],
  },
];

const App = {
  USE_MOCK: true,
  PAGES: {
    LOADER: 'loader',
    LIST: 'list',
    ITEM: 'item',
  },

  state: {
    page: 'list',
    beaches: [],
  },

  setState: state => {
    $.extend(App.state, state);
    App.render();
  },

  fetchData: () => {
    return App.USE_MOCK
      ? Promise.resolve(dataMock)
      : $.ajax('http://example.com/beaches');
  },

  init: () => {
    App.setState({page: App.PAGES.LOADER});

    App
      .fetchData()
      .then(data => {
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
    const {beachId} = $(event.target).data();

    console.log({beachId});
  },

  render: () => {
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
      }
    }

    console.log({state: App.state});
  },
};

$(() => {
  App.init();
});
