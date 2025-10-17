// File: src/api/eventService.js
import axios from 'axios';

// In a real app, this would be your backend API base URL
const API_URL = 'https://api.example.com';

const mockEvents = [
    { id: 1, name: 'Tech Conference 2025', date: '2025-11-20', location: 'Virtual' },
    { id: 2, name: 'Design Workshop', date: '2025-12-05', location: 'New York' },
];

// Mock function to get all events
export const getAllEvents = async () => {
    console.log('Fetching all events...');
    // In a real app: return await axios.get(`${API_URL}/events`);
    return Promise.resolve({ data: mockEvents });
};

// Mock function to create an event
export const createEvent = async (eventData) => {
    console.log('Creating event:', eventData);
    const newEvent = { id: Math.floor(Math.random() * 1000), ...eventData };
    // In a real app: return await axios.post(`${API_URL}/events`, eventData);
    return Promise.resolve({ data: newEvent });
};

// Mock function to get attendance for an event
export const getAttendance = async (eventId) => {
    console.log(`Fetching attendance for event ID: ${eventId}`);
    const mockAttendance = [
        { id: 101, name: 'Alice', email: 'alice@example.com' },
        { id: 102, name: 'Bob', email: 'bob@example.com' },
    ];
    // In a real app: return await axios.get(`${API_URL}/events/${eventId}/attendance`);
    return Promise.resolve({ data: mockAttendance });
};