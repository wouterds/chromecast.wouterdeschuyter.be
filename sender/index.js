const util = require('util');
const castv2 = require('castv2-client');

const CHROMECAST_IP = '10.10.10.14';

function DashboardController(client, sourceId, destinationId) {
  castv2.RequestResponseController.call(this, client, sourceId, destinationId, 'urn:x-cast:be.wouterdeschuyter.chromecast');
}

util.inherits(DashboardController, castv2.RequestResponseController);

DashboardController.prototype.setData = function(data, callback) {
  this.request(data, (err, response) => callback(err, response));
};

class Dashboard extends castv2.Application {
  constructor() {
    super(...arguments);

    this.dashboardController = this.createController(DashboardController);
  }

  setUrl(url, callback) {
    this.dashboardController.setData({ url }, callback);
  }
};

Dashboard.APP_ID = '7D24DA96';

const client = new castv2.Client();

client.connect(CHROMECAST_IP, () => {
  client.launch(Dashboard, (err, app) => {
    if (err) {
      console.error(err);
    } else {
      app.setUrl('https://promo-widget.delta.app/');
    }
  });
});

client.on('status', (event) => {
  console.log('Status event', event);
});

client.on('error', (err) => {
  console.error('Error occured', err.message);
  client.close();
});
