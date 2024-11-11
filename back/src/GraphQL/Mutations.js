const db = require('../models');
const bcrypt = require('bcrypt');
const path = require('path'); const fs = require('fs');
const { Op } = require('sequelize');

module.exports = (schemaComposer) => {
    schemaComposer.Mutation.addFields({
        register: {
            type: 'User',
            args: {
                name: { type: 'String' },
                email: { type: 'String' },
                password: { type: 'String' }
            },
            resolve: async (_, { name, email, password }) => {
                const existingUser = await db.User.findOne({ where: { email } });

                if (existingUser)
                    throw new Error('Email is already in use. Please choose another one.');

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await db.User.create({ name, email, password: hashedPassword });

                return user;
            }
        },
        createNode: {
            type: 'Node',
            args: {
                name: { type: 'String!' },
                type: { type: 'String!' },
                parentId: { type: 'Int' },
                file: { type: 'Upload' }
            },
            resolve: async (_, { name, type, parentId, file }, { user }) => {
                if (!user) throw new Error('You need to be logged in to create files');

                const node = await db.Node.create({ name, type, parentId: parentId ?? null, ownerId: user.id });
                console.log(node, name, type, parentId, file);

                if (node && file)
                    if (file.length != 0) {
                        const { buffer } = await file[0];

                        const directory = path.join(__dirname, '../database/files');

                        if (!fs.existsSync(directory))
                            fs.mkdirSync(directory);

                        const filePath = path.join(directory, node.id + "." + type);

                        fs.writeFileSync(filePath, buffer);
                    }

                return node;
            }
        },
        renameNode: {
            type: 'Node',
            args: {
                id: { type: 'Int!' },
                newName: { type: 'String!' }
            },
            resolve: async (_, { id, newName }, { user }) => {
                if (!user) throw new Error('You need to be logged in to rename a file');

                const node = await db.Node.findOne({ where: { id, ownerId: user.id } });
                if (!node) throw new Error('Node not found or you do not have permission to rename it.');

                node.name = newName;
                await node.save();

                return node;
            }
        },
        deleteNode: {
            type: 'Boolean',
            args: {
                id: { type: 'Int!' }
            },
            resolve: async (_, { id }, { user }) => {
                if (!user) throw new Error('You need to be logged in to delete a file');

                const node = await db.Node.findOne({ where: { [Op.or]: [{ id }, { parentId: id }], ownerId: user.id } });
                if (!node) throw new Error('Node not found or you do not have permission to delete it.');

                const filePath = path.join(__dirname, '../database/files', `${node.id}.${node.type}`);

                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

                await node.destroy();

                return true;
            }
        }
    });

    return schemaComposer;
};