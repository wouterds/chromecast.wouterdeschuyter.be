const util = require('util');
const castv2 = require('castv2-client');
const nodecast = require('nodecast');

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

const network = nodecast.find();

network.on('device', device => {
  const ip = new URL(device.httpBase).hostname;

  console.log(`Connecting to ${ip}`);

  const client = new castv2.Client();
  client.on('status', e => console.log('Status', e));
  client.on('error', e => {
    console.error('Error', e.message);
    client.close();
  });

  client.connect(ip, () => {
    client.launch(Dashboard, (err, app) => {
      if (err) {
        console.error(err);
        return;
      }

      app.setUrl('https://promo-widget.delta.app/');
    });
  });
});

