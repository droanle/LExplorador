const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

module.exports = (schemaComposer) => {
    schemaComposer.Query.addFields({
        login: {
            type: 'String',
            args: { email: 'String!', password: 'String!' },
            resolve: async (_, { email, password }) => {
                const user = await db.User.findOne({ where: { email } });

                if (!user || !await bcrypt.compare(password, user.password))
                    throw new Error('Invalid credentials');

                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    '5fa51273e3be40cf0c17a7bfdabc68ff',
                    { expiresIn: '3h' }
                );

                return token;
            }
        },
        getNodes: {
            type: '[Node]',
            args: { parentId: 'Int' },
            resolve: async (_, { parentId }, { user }) => {
                if (!user) throw new Error('You need to be logged in to get files');

                var nodes = await db.Node.findAll({
                    where: {
                        ownerId: user.id,
                        parentId: parentId ? parentId : { [Op.is]: null }
                    }
                });

                return nodes;
            }
        },
        getContentNodes: {
            type: 'Buffer',
            args: { id: 'Int' },
            resolve: async (_, { id }, { user }) => {
                if (!user) throw new Error('You need to be logged in to view nodes');

                const nodes = await db.Node.findAll({
                    where: { id: id, ownerId: user.id, type: { [Op.not]: "folder" } }
                });

                const nodesWithContent = await Promise.all(nodes.map(async (node) => {
                    const filePath = path.join(__dirname, '../database/files', `${node.id}.${node.type}`);

                    if (fs.existsSync(filePath)) {
                        const buffer = fs.readFileSync(filePath);
                        return { buffer: buffer.toString('base64') };
                    } else
                        return { buffer: null };
                }));

                return nodesWithContent[0];
            }
        }
    });

    return schemaComposer;
};
