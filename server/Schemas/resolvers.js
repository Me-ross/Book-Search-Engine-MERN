const { AuthenticationError } = require('apollo-server-express');
// import user model
const { User, Book } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // users: async (parent, args) => {
    //   return await User.findById(args.id).populate('savedBooks');
    // },
    me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutations: {
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
  
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
  
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
  
      return { token, user };
    },
    saveBook: async (parent, { bookId, authors, description, image, link, title }, context) => {
      if (context.user) {  
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId, authors, description, image, link, title } } },
          { new: true, runValidators: true }
        );
    
        return User;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
}

module.exports = resolvers;