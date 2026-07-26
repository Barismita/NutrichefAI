import { TextField } from "@mui/material";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
    return (
        <TextField
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            size="small"
        />
    );
};

export default SearchBar;
