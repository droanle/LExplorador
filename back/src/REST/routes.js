const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email is already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({ name, email, password: hashedPassword });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, '5fa51273e3be40cf0c17a7bfdabc68ff', { expiresIn: '3h' });
        res.json(token);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/node', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Invalid token' });
    const { name, type, parentId } = req.body;
    const file = req.file;

    try {
        const node = await db.Node.create({ name, type, parentId: parentId ?? null, ownerId: req.user.id });

        if (node && file) {
            const { buffer } = await file[0];

            const directory = path.join(__dirname, '../database/files');

            if (!fs.existsSync(directory))
                fs.mkdirSync(directory);

            const filePath = path.join(directory, node.id + "." + type);

            fs.writeFileSync(filePath, buffer);
        }

        res.json(node);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/node/contentNode/:id', async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Invalid token' });


    const { id } = req.params;

    try {
        const node = await db.Node.findOne({
            where: { id: id, ownerId: req.user.id, type: { [Op.not]: "folder" } }
        });

        if (!node)
            return res.status(404).json({ error: 'Node not found' });

        const filePath = path.join(__dirname, '../database/files', `${node.id}.${node.type}`);

        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const base64Content = buffer.toString('base64');
            res.json({ buffer: base64Content });
        } else
            res.json({ buffer: null });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/node/:id/rename', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Invalid token' });
    const { id } = req.params;
    const { newName } = req.body;

    try {
        const node = await db.Node.findOne({ where: { id, ownerId: req.user.id } });
        if (!node) return res.status(404).json({ error: 'Node not found or no permission' });

        node.name = newName;
        await node.save();

        res.json(node);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/node/:id', async (req, res) => {

    if (!req.user) return res.status(401).json({ error: 'Invalid token' });
    const { id } = req.params;

    try {
        const node = await db.Node.findOne({ where: { id, ownerId: req.user.id } });
        if (!node) return res.status(404).json({ error: 'Node not found or no permission' });

        const filePath = path.join(__dirname, '../database/files', `${node.id}.${node.type}`);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await node.destroy();
        return res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/nodes', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Invalid token' });
    const { parentId } = req.query;

    try {
        const nodes = await db.Node.findAll({
            where: {
                ownerId: req.user.id,
                parentId: parentId ? parentId : { [Op.is]: null }
            }
        });

        return res.status(200).json(nodes);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
