import { Alert } from "@mui/material";

const ErrorMessage = ({ message = "Something went wrong." }) => {
    return <Alert severity="error">{message}</Alert>;
};

export default ErrorMessage;
