const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Node extends Model {
        static associate(models) {
            Node.belongsTo(models.User, { foreignKey: 'ownerId' });
            Node.hasMany(models.Node, { foreignKey: 'parentId', as: 'children' });
            Node.belongsTo(models.Node, { foreignKey: 'parentId', as: 'parent' });
        }
    }

    Node.init({
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        parentId: DataTypes.INTEGER,
        ownerId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Node',
    });

    return Node;
};
