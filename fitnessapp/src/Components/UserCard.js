import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card variant="outlined" style={{ width: '100%', marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {user.fullName}
        </Typography>
        <Typography color="textSecondary">
          Email: {user.email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;