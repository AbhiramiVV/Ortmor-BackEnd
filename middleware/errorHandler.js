import { ErrorCodes } from "../Utils/constants.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case ErrorCodes.VALIDATION_ERROR:
      res.json({
        title: "The request contains invalid data or missing parameters.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.NOT_FOUND:
      res.json({
        title: "The requested resource could not be found.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.UNAUTHORIZED:
      res.json({
        title: "The request requires user authentication.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.FORBIDDEN:
      res.json({
        title:
          "The server understood the request, but refuses to authorize it.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.SERVER_ERROR:
      res.json({
        title:
          " An internal server error occurred while processing the request.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ErrorCodes.METHOD_NOT_ALLOWED:
      res.json({
        title: "The request method is not allowed for the specified resource.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ErrorCodes.CONFLICT:
      res.json({
        title:
          "The request could not be completed due to a conflict with the current state of the resource.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ErrorCodes.BAD_GATEWAY:
      res.json({
        title:
          "The server received an invalid response from an upstream server.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ErrorCodes.SERVICE_UNAVAILABLE:
      res.json({
        title:
          "The server is currently unable to handle the request due to temporary overloading or maintenance of the server.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ErrorCodes.GATEWAY_TIMEOUT:
      res.json({
        title:
          "The server did not receive a timely response from an upstream server.",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    default:
      console.log("No Error. Good to go.");
      break;
  }
};
