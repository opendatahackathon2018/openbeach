const App = {
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
    const promise = $.get('beaches.json');

    return promise
      .fail((...data) => {
        console.log('fail', ...data);
      });
  },

  init: () => {
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

    console.log({ beachId });
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

    console.log({ state: App.state });
  },
};

$(() => {
  App.init();
});
