import React from 'react';
import { Card, CardMedia, CardActionArea, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '200px',
  height: '335px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
  '&:hover .details': {
    transform: 'translateY(0)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '&:hover img': {
    filter: 'blur(2px)',
  },
  '&:hover': {
    boxShadow: `0 4px 15px rgba(0, 129, 198, 0.8)`,
    transform: 'scale(1.05)',
  },
}));

const Details = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease',
  color: 'white',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  },
}));

export default function ProductCard({ product }) {
  return (
    <StyledCard>
      <CardActionArea>
        <CardMedia
          component="img"
          height="335"
          image={product.imageUrl}
          alt={product.name}
          sx={{ transition: 'filter 0.3s ease, transform 0.3s ease' }}
        />
      </CardActionArea>
      <Details className="details">
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="white">
            {product.description}
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', marginTop: 'auto' }}>
            ${product.price}
          </Typography>
        </CardContent>
        <StyledButton size="small">
          Add to Cart
        </StyledButton>
      </Details>
    </StyledCard>
  );
}