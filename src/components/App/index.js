//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';

type State = {
  url: ?string,
};

class App extends Component<{}, State> {
  state: State = {
    url: null,
  };

  chromecastSetup = () => {
    declare var cast: any;

    const receiverContext = cast.framework.CastReceiverContext.getInstance();

    receiverContext.addCustomMessageListener('urn:x-cast:be.wouterdeschuyter.chromecast', event => {
      if (!(event && event.data && event.data.url)) {
        return;
      }

      this.setState({ url: event.data.url });
    });

    receiverContext.start({ statusText: 'Starting..' });
  };

  componentDidMount() {
    this.chromecastSetup();
  }

  render(): Node {
    const { url } = this.state;

    if (!url) {
      return 'Loading..';
    }

    return <iframe className={styles.container} src={url} />;
  }
}

export default App;
