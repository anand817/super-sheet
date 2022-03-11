export default class Home {
  static get(request, response, _) {
    response.end(JSON.stringify({greeting: 'Hello world!'}));
  }
}
