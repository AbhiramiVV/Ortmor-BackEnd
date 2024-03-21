import { ErrorCodes } from "../Utils/constants";



export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case ErrorCodes.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case ErrorCodes.SERVER_ERROR:
      res.json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
      case ErrorCodes.METHOD_NOT_ALLOWED:
        res.json({
          title: "Method not allowed",
          message: err.message,
          stackTrace: err.stack,
        });
        break;
        case ErrorCodes.CONFLICT:
          res.json({
            title: "Conflict",
            message: err.message,
            stackTrace: err.stack,
          });
          break;
          case ErrorCodes.BAD_GATEWAY:
            res.json({
              title:"Bad gateway",
              message:err.message,
              stackTrace:err.stack,
            })
            break;
            
    default:
      console.log("No Error. Good to go.");
      break;
  }
};