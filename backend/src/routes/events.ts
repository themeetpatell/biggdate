import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Mock events data
const events = [
  {
    id: '1',
    title: 'Founder Mastermind Retreat',
    description: 'Join 20 handpicked founders for a 3-day intensive mastermind in Napa Valley.',
    type: 'retreat',
    location: 'Napa Valley, CA',
    startDate: new Date('2024-02-15T09:00:00'),
    endDate: new Date('2024-02-17T17:00:00'),
    maxAttendees: 20,
    attendees: ['15'],
    organizerId: '1',
    isActive: true,
    createdAt: new Date()
  }
];

// Get events
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register for event
router.post('/:id/register', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In real app, add user to event attendees
    console.log(`User registering for event ${id}`);

    res.json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unregister from event
router.delete('/:id/unregister', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In real app, remove user from event attendees
    console.log(`User unregistering from event ${id}`);

    res.json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create event
router.post('/', (req: Request, res: Response) => {
  try {
    const eventData = req.body;

    // In real app, save to database
    console.log('Creating event:', eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: '2', ...eventData }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
