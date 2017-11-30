var path = require('path'),
    express = require('express'),
		app = express(),
		webpackDevHelper = require('./index.dev.js'),
    api = require('./api/api.js')
    bodyParser = require('body-parser')


if (process.env.NODE_ENV !== 'production') {
    console.log('DEVOLOPMENT ENVIRONMENT: Turning on WebPack Middleware...')
    webpackDevHelper.useWebpackMiddleware(app)
} else {
    console.log('PRODUCTION ENVIRONMENT')
    app.use('/js', express.static(__dirname + '/dist/js'))
}
 
app.use(bodyParser.json());

// Setting up express to serve static files
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use('/api', api);

// we always want to serve the index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets/index.html'))
})

app.listen(3000)