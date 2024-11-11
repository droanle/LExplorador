const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require("./GraphQL/Schema");
const sequelize = require('./database/config/DAO');
const multer = require('multer');
const cors = require('cors');
const db = require('./models');
const jwt = require('jsonwebtoken');
const routes = require('./REST/routes');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.use(
    (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return next();

        jwt.verify(token, '5fa51273e3be40cf0c17a7bfdabc68ff', async (err, user) => {
            if (err) return next();

            const User = await db.User.findByPk(user.id);
            if (User) req.user = User;

            return next();
        });
    },
    upload.any(),
    (req, res, next) => {
        if (req.headers['content-type'] != 'application/json')
            try {
                operations = JSON.parse(req.body.operations)
                map = JSON.parse(req.body.map);

                if (operations.variables.file !== undefined)
                    operations.variables.file = req.files;

                req.operations = operations;
                req.map = map;

                req.body = operations;
            } catch (error) {
                return next();
            }

        return next();
    }
);

app.use(routes);

app.use(
    '/graphql',
    graphqlHTTP((req, res) => ({
        schema,
        context: { user: req.user },
        graphiql: true,
    }))
);

sequelize.sync().then(() => {
    app.listen(8001, () => console.log('Server running on http://localhost:8001/graphql'));
})
    .catch(err => {
        console.error('Error syncing the database:', err);
    });
