/* eslint-disable react/prop-types */
import { Card as MuiCard, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

const Card = ({ image, title, description, link }) => (
    <MuiCard sx={{ width: 250, boxShadow: 3 }}>
        <CardMedia component="img" height="140" image={image} alt={title} />
        <CardContent>
            <Typography variant="h6" component="div">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{description}</Typography>
        </CardContent>
        <CardActions>
            <Button size="small" href={link} target="_blank">Learn More</Button>
        </CardActions>
    </MuiCard>
);

export default Card;
