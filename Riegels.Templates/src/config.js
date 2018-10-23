module.exports = function () {
    return {
        vendors: ['jquery', 'popper.js', 'bootstrap', 'moment', 'handlebars', 'scrollreveal'],
        browser_sync: {
            port: 8000,
            ui: 8080
        },
        quicktype: {
            distributionPath: './dist/csharp/',
            rootUrl: 'http://localhost:3000',
            modelServicePaths: [{
                    fileName: "Article",
                    url: "/api/articles"
                },
                {
                    fileName: "HeroVideo",
                    url: "/api/heroVideos"
                }
            ]
        }
    }
}