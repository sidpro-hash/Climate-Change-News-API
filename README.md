# Climate-Change-News-API
An API Showing all the latest Climate Change News around the world.

The API is available at `https://climate-changenews.herokuapp.com/`

## Endpoints ##

### Status ###

GET `/`

Returns the status of the API.

### List of News ###

GET `/news`

Returns a list of Climate Change news.


### Get a News from Specific source ###

GET `/news/:newspapperId`

Retrieve detailed information about a Climate change from newspapper.

Example
```
GET /news/thetimes
newspapperId: [telegraph,thetimes,guardian]
```
