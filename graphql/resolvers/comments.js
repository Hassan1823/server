const { UserInputError, AuthenticationError } = require("apollo-server");

const Post = require("../../models/Posts");
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Mutation: {
    // !create comment
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post Not Found ");
      }
    },
    //     !delete comments
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      // ! if we found the post
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        if (post.comments[commentIndex].username === username) {
          // !delete the comment if user is owner of the post
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          // ! if user is not owner of the post
          throw new AuthenticationError("Action Not Allowed");
        }
      } else {
        //! if post is not found
        throw new UserInputError("Post Not Found");
      }
    },
  },
};
