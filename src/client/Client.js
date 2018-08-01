class Client {
  constructor(host, encoder = null) {
    this.socket = new WebSocket(host, 'websocket');
    this.encoder = encoder;

    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('close', this.onClose);
    this.socket.addEventListener('error', this.onError);
    this.socket.addEventListener('message', this.onMessage);
  }

  /**
   * Send data over WebSocket
   *
   * @param {String} name
   * @param {Object} data
   */
  send(name, data) {
    this.socket.send(this.encoder.encode(name, data));
  }

  /**
   * Close connection
   */
  close() {
    this.socket.close();
    this.onClose();
  }

  /**
   * On connexion open
   */
  onOpen(event) {
    console.info('Connection open');
  }

  /**
   * On message received from the server
   *
   * @param {Event} event
   */
  onMessage(event) {
    const { name, data } = this.encoder.decode(event.data);

    console.log(name, data);
  }

  /**
   * On close
   */
  onClose() {
    this.socket.removeEventListener('open', this.onOpen);
    this.socket.removeEventListener('close', this.onClose);
    this.socket.removeEventListener('error', this.onError);
    this.socket.removeEventListener('message', this.onMessage);
  }

  /**
   * On error
   *
   * @param {Error} error
   */
  onError(error) {
    console.error(error);
  }
}
