import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Incident from '../models/Incident';
import Asset from '../models/Asset';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { sendPushNotificationToTechnicians } from '../services/pushService';

export const createIncident = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { assetId, description, mediaUrls } = req.body;
  if (!assetId || !description) {
    return next(new AppError('Missing required fields: assetId, description', 400));
  }

  const asset = await Asset.findById(assetId);
  if (!asset) {
    return next(new AppError('Asset not found', 404));
  }

  const incident = await Incident.create({
    assetId,
    description,
    mediaUrls: mediaUrls || [],
    reportedBy: req.user._id,
    status: 'Open'
  });

  // Trigger web push in background
  sendPushNotificationToTechnicians({
    title: 'New Incident Reported',
    body: `A new incident has been reported for asset ${asset.name}`
  });

  res.status(201).json({
    status: 'success',
    data: { incident }
  });
});

export const getIncidents = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let filter = {};
  if (req.user.role === 'student') {
    filter = { reportedBy: req.user._id };
  }

  const incidents = await Incident.find(filter)
    .populate('assetId', 'name tagId healthStatus')
    .populate('reportedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: { incidents }
  });
});

export const getIncidentById = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const incident = await Incident.findById(req.params.id)
    .populate('assetId', 'name tagId healthStatus')
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('activityLogs.createdBy', 'name role');

  if (!incident) {
    return next(new AppError('Incident not found', 404));
  }

  if (req.user.role === 'student' && incident.reportedBy._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Forbidden', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { incident }
  });
});

export const updateIncidentStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { status } = req.body;
  if (!['In Progress', 'Resolved'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    return next(new AppError('Incident not found', 404));
  }

  incident.status = status;
  if (status === 'In Progress' && !incident.assignedTo) {
    incident.assignedTo = req.user._id;
  }
  await incident.save();

  res.status(200).json({
    status: 'success',
    data: { incident }
  });
});

export const addActivityLog = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { content } = req.body;
  if (!content) {
    return next(new AppError('Missing activity content', 400));
  }

  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    return next(new AppError('Incident not found', 404));
  }

  incident.activityLogs.push({
    message: content,
    createdBy: req.user._id,
    createdAt: new Date()
  });

  await incident.save();

  res.status(201).json({
    status: 'success',
    data: { incident }
  });
});
