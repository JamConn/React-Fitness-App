import asyncHandler from 'express-async-handler';
import express from 'express';

const router = express.Router();

// using fit store
app.get('/steps', async (req, res, next) => {
	try {
		oAuth2Client.setCredentials({ access_token: req.token });
		const fitnessStore = google.fitness({ version: 'v1', auth: oAuth2Client });
		const dataTypeName = 'com.google.step_count.delta';
		const dataSourceId = 'derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas';
		const data = {
			aggregateBy: [{ dataTypeName, dataSourceId }],
			bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
			startTimeMillis: Date.now() - 20 * 24 * 60 * 60 * 1000,
			endTimeMillis: Date.now()
		};
		const result = await fitnessStore.users.dataset.aggregate({
			userId: 'me',
			requestBody: data,
			fields: 'bucket(dataset(point(value(intVal))))'
		});
		res.json(result);
	} catch (error) {
		next(error);
	}
});

// using fetch
app.get('/steps2', async (req, res, next) => {
	try {
		const dataTypeName = 'com.google.step_count.delta';
		const dataSourceId = 'derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas';
		const now = Date.now();
		const data = {
			aggregateBy: [{ dataTypeName, dataSourceId }],
			bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
			startTimeMillis: now - 3 * 24 * 60 * 60 * 1000,
			endTimeMillis: now,
		};
		const endpoint =
			'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate?fields=bucket(dataset(point(value(intVal))))';
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${req.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();
		res.json(result);
	} catch (error) {
		next(error);
	}
});

// error handler middleware
app.use((err, req, res, next) => {
	res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
	console.log(`App listening at ${PORT}`);
});