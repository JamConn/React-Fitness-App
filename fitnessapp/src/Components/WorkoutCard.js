import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AddWorkoutButton from './AddWorkoutButton';

const WorkoutCard = ({ name, description, videoUrl, bodyPart, showAddButton }) => {
  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match && match[1];
  };

  // Function to generate embed URL
  const generateEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const embedUrl = generateEmbedUrl(videoUrl);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" fontWeight='bold'>
          {name}
        </Typography>
        <Typography variant="h6" color="text">
          Body Part: {bodyPart}
        </Typography>
        <Typography variant="body" color="text.secondary">
          {description}
        </Typography>

        <div>
          <iframe
            title={name}
            width="100%"
            height="315"
            src={embedUrl}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        {showAddButton && <AddWorkoutButton />}
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;