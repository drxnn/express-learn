export const validateNewCreatedUser = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "needs to be 5-32 characters long",
    },
    notEmpty: {
      errorMessage: "username cannot be empty",
    },
    isString: {
      errorMessage: "username has to be a string",
    },
  },
};
