/* eslint-disable react/prop-types */
import { Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const FilterWithTooltip = ({ label, options, value, handleChange, tooltipText }) => (
    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={(e) => handleChange(e.target.value)} label={label}>
            <MenuItem value="all">All</MenuItem>
            {options.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </Select>
        <Tooltip title={tooltipText} arrow>
            <IconButton>
                <InfoIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </FormControl>
);

export default FilterWithTooltip;
