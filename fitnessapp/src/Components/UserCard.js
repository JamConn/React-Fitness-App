import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card variant="outlined" style={{ width: '100%', marginBottom: '10px' }}>
      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={user.profilePicture} alt={user.fullName} style={{ marginRight: '10px', width: '80px', height: '80px' }} />
        <div>
          <Typography variant="h5" component="h2">
            {user.fullName}
          </Typography>
          <Typography color="textSecondary">
            Email: {user.email}
          </Typography>
          <Typography color="textSecondary">
            Level: {user.level}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;