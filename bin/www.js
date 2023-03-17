const app = require('../app')
const db = require('../config/db')

const port = process.env.PORT || 4000;


db().then(d => {
    try {
        app.listen( port, () => {
            console.log(`Server is up ${port}.`);
        });
    } catch (err) {
        console.log("Error:::", err);
    }

})
