module.exports = (schemaComposer) => {
    const UploadType = schemaComposer.createScalarTC({
        name: 'Upload',
        description: "The `Upload` scalar type represents a file upload.",
        serialize() {
            throw new GraphQLError("Upload serialization unsupported.");
        },
        parseValue(value) {
            return value;
        },
        parseLiteral(node) {
            throw new GraphQLError("Upload literal unsupported.", { nodes: node });
        },
    });

    const UserType = schemaComposer.createObjectTC({
        name: 'User',
        fields: {
            id: 'Int',
            name: 'String',
            email: 'String',
            createdAt: 'Date',
            updatedAt: 'Date'
        }
    });

    const NodeType = schemaComposer.createObjectTC({
        name: 'Node',
        fields: {
            id: 'Int!',
            name: 'String!',
            type: 'String!',
            parentId: {
                type: 'Int',
                resolve: (source) => source.parentId === '' ? null : source.parentId
            },
            createdAt: 'Date',
            updatedAt: 'Date'
        }
    });

    const BufferType = schemaComposer.createObjectTC({
        name: 'Buffer',
        fields: {
            buffer: 'String'
        }
    })

    schemaComposer.set('Upload', UploadType);
    schemaComposer.set('User', UserType);
    schemaComposer.set('Node', NodeType);

    return schemaComposer;
};
