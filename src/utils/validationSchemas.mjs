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

export const validateUserThatWantsToLogIn = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username needs to be 5-32 characters long",
    },
    notEmpty: {
      errorMessage: "username cannot be empty",
    },
    isString: {
      errorMessage: "username has to be a string",
    },
  },
  password: {
    exists: {
      errorMessage: "You need to provide a password",
    },
    isLength: {
      options: {
        min: 8,
        max: 32,
      },
      errorMessage: "Password needs to be of length 8-32 characters",
    },
  },
};
