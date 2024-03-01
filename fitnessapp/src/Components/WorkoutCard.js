import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const WorkoutCard = ({ name, description, videoUrl, bodyPart }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Video URL: {videoUrl}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Body Part: {bodyPart}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;