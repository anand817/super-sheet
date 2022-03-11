export default class Home {
  static get(request, response, _) {
    response.sendFile(__dirname+"/index.html")
  }
}
