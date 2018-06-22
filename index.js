const { GraphQLServer } = require('graphql-yoga');
const photos = require('./data/photos.json');
const users = require('./data/users.json');
// webpack is what allows import statements
// typeDefs are the schema
// graphQL has 5 scalar types: string, id (non human readable string), int, float, boolean
const typeDefs = `
    type User {
        id: ID!,
        name: String!
    }
    type Photo {
        id: ID!,
        name: String,
        description: String,
        category: PhotoCategory
    }
    enum PhotoCategory {
        LANDSCAPE
        SELFIE
        PORTRAIT
    }
    type Query {
        totalPhotos: Int!,
        allPhotos: [Photo!]!,
        allUsers: [User!]!,
        totalUsers: Int!
    }
    input PostPhotoInput {
        name: String!
        description: String
        category: PhotoCategory = PORTRAIT
    }
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo
    }
`

const resolvers = { // process, transform, grab data from anywhere
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos,
        totalUsers: () => users.length,
        allUsers: () => users,
    },
    Mutation: {
        postPhoto: (root, args) => {
            const newPhoto = {
                id: "7",
                ...args.input
            }
            photos.push(newPhoto);
            return newPhoto;
        }
    }
}

const server = new GraphQLServer({
    typeDefs, // schema
    resolvers
});

const options = {
    port: 4000,
    endpoint: '/graphql',
    playground: '/playground'
}

const ready = ({port}) =>
    console.log(`graph service running on port ${port}`);
server.start(options, ready);